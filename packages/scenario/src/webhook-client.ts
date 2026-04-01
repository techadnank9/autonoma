import { createHmac } from "node:crypto";
import type { PrismaClient, WebhookAction } from "@autonoma/db";
import { type Logger, logger } from "@autonoma/logger";
import { fx } from "@autonoma/try";
import type { DiscoverResponse, DownResponse, UpResponse } from "@autonoma/types";
import { DiscoverResponseSchema, DownResponseSchema, UpResponseSchema } from "@autonoma/types";
import type { z } from "zod";

interface WebhookCallParams<T> {
    instanceId?: string;
    action: WebhookAction;
    body: unknown;
    responseSchema: z.ZodType<T>;
    maxRetries: number;
    timeoutMs: number;
}

interface UpParams {
    instanceId: string;
    scenarioName: string;
}

interface DownParams {
    instanceId: string;
    refs: unknown;
    refsToken?: string;
}

interface LogWebhookCallParams {
    instanceId?: string;
    action: WebhookAction;
    requestBody: unknown;
    responseBody?: unknown;
    statusCode?: number;
    durationMs: number;
    error?: string;
}

export class WebhookClient {
    private readonly logger: Logger;

    constructor(
        private readonly db: PrismaClient,
        private readonly applicationId: string,
        private readonly webhookUrl: string,
        private readonly signingSecret: string,
    ) {
        this.logger = logger.child({ name: this.constructor.name });
    }

    async discover(): Promise<DiscoverResponse> {
        return this.call({
            action: "DISCOVER",
            body: { action: "discover" },
            responseSchema: DiscoverResponseSchema,
            maxRetries: 2,
            timeoutMs: 30_000,
        });
    }

    async up({ instanceId, scenarioName }: UpParams): Promise<UpResponse> {
        return this.call({
            instanceId,
            action: "UP",
            body: { action: "up", environment: scenarioName, testRunId: instanceId },
            responseSchema: UpResponseSchema,
            maxRetries: 2,
            timeoutMs: 30_000,
        });
    }

    async down({ instanceId, refs, refsToken }: DownParams): Promise<DownResponse> {
        return this.call({
            instanceId,
            action: "DOWN",
            body: { action: "down", refs, refsToken, testRunId: instanceId },
            responseSchema: DownResponseSchema,
            maxRetries: 5,
            timeoutMs: 60_000,
        });
    }

    private async call<T>(params: WebhookCallParams<T>): Promise<T> {
        const { instanceId, action, body, responseSchema, maxRetries, timeoutMs } = params;

        let lastError: Error | undefined;

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            if (attempt > 0) {
                const backoffMs = Math.min(1000 * 2 ** (attempt - 1), 30_000);
                await new Promise((resolve) => setTimeout(resolve, backoffMs));
            }

            const startTime = Date.now();
            const [result, error] = await fx.runAsync(() => this.executeRequest(body, timeoutMs));
            const durationMs = Date.now() - startTime;

            if (error != null) {
                lastError = error;
                await this.logWebhookCall({ instanceId, action, requestBody: body, durationMs, error: error.message });
                this.logger.warn(`Webhook ${action} attempt ${attempt + 1} failed`, {
                    error: error.message,
                    applicationId: this.applicationId,
                });
                continue;
            }

            const { status, responseBody } = result;
            await this.logWebhookCall({
                instanceId,
                action,
                requestBody: body,
                responseBody,
                statusCode: status,
                durationMs,
            });

            if (status < 200 || status >= 300) {
                lastError = new Error(`Webhook returned status ${status}`);
                this.logger.warn(`Webhook ${action} returned ${status}`, {
                    applicationId: this.applicationId,
                    status,
                });
                continue;
            }

            const [parsed, parseError] = fx.run(() => responseSchema.parse(responseBody));
            if (parseError != null) {
                throw new Error(`Webhook ${action} response validation failed: ${parseError.message}`);
            }

            return parsed;
        }

        throw lastError ?? new Error(`Webhook ${action} failed after ${maxRetries + 1} attempts`);
    }

    private async executeRequest(body: unknown, timeoutMs: number): Promise<{ status: number; responseBody: unknown }> {
        const bodyString = JSON.stringify(body);
        const signature = this.sign(bodyString);

        const response = await fetch(this.webhookUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-signature": signature,
            },
            body: bodyString,
            signal: AbortSignal.timeout(timeoutMs),
        });

        const responseBody = await response.json();
        return { status: response.status, responseBody };
    }

    private sign(body: string): string {
        return createHmac("sha256", this.signingSecret).update(body).digest("hex");
    }

    private async logWebhookCall({
        instanceId,
        action,
        requestBody,
        responseBody,
        statusCode,
        durationMs,
        error,
    }: LogWebhookCallParams): Promise<void> {
        const [, logError] = await fx.runAsync(() =>
            this.db.webhookCall.create({
                data: {
                    applicationId: this.applicationId,
                    instanceId,
                    action,
                    requestBody: requestBody as object,
                    responseBody: responseBody != null ? (responseBody as object) : undefined,
                    statusCode,
                    durationMs,
                    error,
                },
            }),
        );
        if (logError != null) {
            this.logger.error("Failed to log webhook call", { error: logError.message });
        }
    }
}

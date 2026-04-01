import type { PrismaClient } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import type { StorageProvider } from "@autonoma/storage";
import type { ModelMessage } from "ai";

export interface StepData {
    order: number;
    interaction: string;
    params: unknown;
    output: unknown;
    screenshotBeforeKey?: string;
    screenshotAfterKey?: string;
}

export interface GenerationData {
    generationId: string;
    organizationId: string;
    testPlanPrompt: string;
    conversation: ModelMessage[];
    reasoning?: string;
    videoUrl?: string;
    finalScreenshotKey?: string;
    steps: StepData[];
}

export class GenerationDataLoader {
    constructor(
        private readonly db: PrismaClient,
        private readonly storage: StorageProvider,
    ) {}

    async loadGeneration(generationId: string): Promise<GenerationData> {
        logger.info("Loading generation data", { generationId });

        const generation = await this.db.testGeneration.findUniqueOrThrow({
            where: { id: generationId },
            select: {
                id: true,
                status: true,
                reasoning: true,
                videoUrl: true,
                finalScreenshot: true,
                conversationUrl: true,
                organizationId: true,
                testPlan: { select: { prompt: true } },
                steps: {
                    select: {
                        list: {
                            select: {
                                order: true,
                                interaction: true,
                                params: true,
                                screenshotBefore: true,
                                screenshotAfter: true,
                                outputs: {
                                    select: { output: true },
                                    take: 1,
                                },
                            },
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
        });

        if (generation.status !== "failed") {
            throw new Error(`Generation ${generationId} has status "${generation.status}", expected "failed"`);
        }

        const steps: StepData[] = (generation.steps?.list ?? []).map((input) => ({
            order: input.order,
            interaction: input.interaction,
            params: input.params,
            output: input.outputs[0]?.output,
            screenshotBeforeKey: input.screenshotBefore ?? undefined,
            screenshotAfterKey: input.screenshotAfter ?? undefined,
        }));

        const conversation = await this.loadConversation(generation.conversationUrl);

        logger.info("Generation data loaded", { stepCount: steps.length });

        return {
            generationId: generation.id,
            organizationId: generation.organizationId,
            testPlanPrompt: generation.testPlan.prompt,
            conversation,
            reasoning: generation.reasoning ?? undefined,
            videoUrl: generation.videoUrl ?? undefined,
            finalScreenshotKey: generation.finalScreenshot ?? undefined,
            steps,
        };
    }

    private async loadConversation(conversationUrl: string | null): Promise<ModelMessage[]> {
        if (conversationUrl == null) {
            logger.warn("No conversation URL found - returning empty conversation");
            return [];
        }

        logger.info("Downloading conversation from S3", { conversationUrl });
        const buffer = await this.storage.download(conversationUrl);
        return JSON.parse(buffer.toString("utf-8")) as ModelMessage[];
    }

    async loadScreenshot(s3Key: string): Promise<Buffer> {
        logger.info("Downloading screenshot", { s3Key });
        return this.storage.download(s3Key);
    }

    async downloadVideo(s3Key: string): Promise<Buffer> {
        logger.info("Downloading video", { s3Key });
        return this.storage.download(s3Key);
    }
}

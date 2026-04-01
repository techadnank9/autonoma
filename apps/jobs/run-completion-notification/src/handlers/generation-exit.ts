import { db } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import { env } from "../env";

export async function handleGenerationExit(generationId: string): Promise<void> {
    const generation = await db.testGeneration.findUnique({
        where: { id: generationId },
        select: { status: true },
    });

    if (generation == null) {
        logger.warn("Notification skipped - generation not found", { generationId });
        return;
    }

    if (generation.status !== "failed") {
        logger.info("Generation exit notification skipped for non-failed status", {
            generationId,
            status: generation.status,
        });
        return;
    }

    if (!env.STRIPE_ENABLED) {
        logger.info("Billing notification skipped - STRIPE_ENABLED=false", { generationId });
        return;
    }

    if (env.API_URL == null || env.ENGINE_BILLING_SECRET == null) {
        logger.info("Billing notification skipped - API_URL or ENGINE_BILLING_SECRET not configured", { generationId });
        return;
    }

    const response = await fetch(`${env.API_URL}/v1/stripe/run-failed`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.ENGINE_BILLING_SECRET}`,
        },
        body: JSON.stringify({ generationId }),
    });

    if (!response.ok) {
        throw new Error(
            `Billing refund notification failed with status ${response.status} for generation ${generationId}`,
        );
    }

    logger.info("Generation exit billing refund notification succeeded", { generationId });
}

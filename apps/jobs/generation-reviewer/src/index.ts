import { CostCollector, MODEL_ENTRIES, ModelRegistry, VideoProcessor } from "@autonoma/ai";
import { db } from "@autonoma/db";
import { logger, runWithSentry } from "@autonoma/logger";
import { BUG_CONFIDENCE_THRESHOLD, BugLinker, BugMatcher } from "@autonoma/review";
import { S3Storage } from "@autonoma/storage";
import { GoogleGenAI } from "@google/genai";
import { GenerationDataLoader } from "./data-loader";
import { env } from "./env";
import { GenerationReviewer } from "./generation-reviewer";
// Retrigger CI - remove later
const generationIdArg = process.argv[2];
if (generationIdArg == null) {
    console.error("Usage: generation-reviewer <generationId>");
    process.exit(1);
}
const generationId: string = generationIdArg;

async function main() {
    logger.info("Starting generation reviewer", { generationId });

    const generation = await db.testGeneration.findUniqueOrThrow({
        where: { id: generationId },
        select: {
            status: true,
            organizationId: true,
            generationReview: { select: { id: true, status: true } },
        },
    });

    if (generation.status !== "failed") {
        logger.info("Generation is not failed - skipping review", {
            generationId,
            status: generation.status,
        });
        return;
    }

    const existingReview = generation.generationReview;
    if (existingReview != null && existingReview.status === "completed") {
        logger.info("A completed review already exists - skipping", { generationId });
        return;
    }

    if (existingReview == null) {
        logger.info("Creating generation review record", { generationId });
        await db.generationReview.create({
            data: {
                generationId,
                organizationId: generation.organizationId,
            },
        });
    }

    const storage = S3Storage.createFromEnv();
    const dataLoader = new GenerationDataLoader(db, storage);

    const data = await dataLoader.loadGeneration(generationId);

    const costCollector = new CostCollector();
    const registry = new ModelRegistry({
        models: { GEMINI_3_FLASH_PREVIEW: MODEL_ENTRIES.GEMINI_3_FLASH_PREVIEW },
        monitoring: costCollector.createMonitoringCallbacks(),
    });

    const model = registry.getModel({ model: "GEMINI_3_FLASH_PREVIEW", tag: "analysis" });

    const genAI = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
    const videoProcessor = new VideoProcessor(genAI);

    const bugMatcher = new BugMatcher(model);
    const bugLinker = new BugLinker(bugMatcher);

    const reviewer = new GenerationReviewer(model, dataLoader, videoProcessor);
    const result = await reviewer.review(data);

    const verdict = result.verdict;

    if (verdict == null) {
        logger.warn("Review did not produce a verdict - marking as failed", { generationId: data.generationId });

        await db.generationReview.update({
            where: { generationId: data.generationId },
            data: { status: "failed" },
        });

        return;
    }

    logger.info("Persisting review result", { verdict: verdict.verdict });

    const enrichedEvidence = verdict.evidence.map((item) => {
        if (item.type === "screenshot" && data.finalScreenshotKey != null) {
            return { ...item, s3Key: data.finalScreenshotKey };
        }
        if (item.type === "video" && data.videoUrl != null) {
            return { ...item, s3Key: data.videoUrl };
        }
        return item;
    });

    await db.$transaction(async (tx) => {
        const review = await tx.generationReview.update({
            where: { generationId: data.generationId },
            data: {
                status: "completed",
                verdict: verdict.verdict,
                reasoning: verdict.reasoning,
                analysis: {
                    failurePoint: verdict.failurePoint,
                    evidence: enrichedEvidence,
                },
            },
        });

        const issue = await tx.issue.upsert({
            where: { generationReviewId: review.id },
            create: {
                generationReviewId: review.id,
                category: verdict.verdict,
                confidence: verdict.confidence,
                severity: verdict.severity,
                title: verdict.title,
                description: verdict.reasoning,
                organizationId: data.organizationId,
            },
            update: {
                category: verdict.verdict,
                confidence: verdict.confidence,
                severity: verdict.severity,
                title: verdict.title,
                description: verdict.reasoning,
            },
        });

        if (verdict.verdict === "application_bug" && verdict.confidence >= BUG_CONFIDENCE_THRESHOLD) {
            const generation = await tx.testGeneration.findUniqueOrThrow({
                where: { id: data.generationId },
                select: {
                    snapshot: { select: { branchId: true } },
                    testPlan: { select: { testCaseId: true } },
                },
            });

            await bugLinker.linkIssueToBug(tx, {
                issueId: issue.id,
                issueTitle: verdict.title,
                issueDescription: verdict.reasoning,
                branchId: generation.snapshot.branchId,
                testCaseId: generation.testPlan.testCaseId,
                severity: verdict.severity,
                organizationId: data.organizationId,
            });
        }

        const costRecords = costCollector.getRecords();
        if (costRecords.length > 0) {
            logger.info("Saving cost records", { count: costRecords.length });
            await tx.aiCostRecord.createMany({
                data: costRecords.map((record) => ({
                    generationId: data.generationId,
                    model: record.model,
                    tag: `review/${record.tag}`,
                    inputTokens: record.inputTokens,
                    outputTokens: record.outputTokens,
                    reasoningTokens: record.reasoningTokens,
                    cacheReadTokens: record.cacheReadTokens,
                    costMicrodollars: record.costMicrodollars,
                })),
            });
        }
    });

    logger.info("Generation review completed successfully", {
        verdict: verdict.verdict,
        generationId: data.generationId,
    });
}

await runWithSentry({ name: "generation-reviewer", tags: { generationId } }, async () => {
    try {
        await main();
    } catch (error) {
        logger.fatal("Generation reviewer failed", error);

        try {
            await db.generationReview.update({
                where: { generationId },
                data: { status: "failed" },
            });
        } catch (updateError) {
            logger.error("Failed to update review status to failed", updateError);
        }

        throw error;
    }
});

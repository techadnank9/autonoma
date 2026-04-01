import { CostCollector, MODEL_ENTRIES, ModelRegistry, VideoProcessor } from "@autonoma/ai";
import { db } from "@autonoma/db";
import { logger, runWithSentry } from "@autonoma/logger";
import { BUG_CONFIDENCE_THRESHOLD, BugLinker, BugMatcher } from "@autonoma/review";
import { S3Storage } from "@autonoma/storage";
import { GoogleGenAI } from "@google/genai";
import { RunDataLoader } from "./data-loader";
import { env } from "./env";
import { ReplayReviewer } from "./replay-reviewer";

const runIdArg = process.argv[2];
if (runIdArg == null) {
    console.error("Usage: replay-reviewer <runId>");
    process.exit(1);
}
const runId: string = runIdArg;

async function main() {
    logger.info("Starting replay reviewer", { runId });

    const run = await db.run.findUniqueOrThrow({
        where: { id: runId },
        select: {
            status: true,
            assignment: {
                select: {
                    testCase: {
                        select: {
                            application: { select: { organizationId: true } },
                        },
                    },
                },
            },
            runReview: { select: { id: true, status: true } },
        },
    });

    if (run.status !== "failed") {
        logger.info("Run is not failed - skipping review", { runId, status: run.status });
        return;
    }

    const existingReview = run.runReview;
    if (existingReview != null && existingReview.status === "completed") {
        logger.info("A completed review already exists - skipping", { runId });
        return;
    }

    if (existingReview == null) {
        const organizationId = run.assignment.testCase.application.organizationId;
        logger.info("Creating run review record", { runId });
        await db.runReview.create({
            data: {
                runId,
                organizationId,
            },
        });
    }

    const storage = S3Storage.createFromEnv();
    const dataLoader = new RunDataLoader(db, storage);

    const data = await dataLoader.loadRun(runId);

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

    const reviewer = new ReplayReviewer(model, dataLoader, videoProcessor);
    const result = await reviewer.review(data);

    const verdict = result.verdict;

    if (verdict == null) {
        logger.warn("Review did not produce a verdict - marking as failed", { runId: data.runId });

        await db.runReview.update({
            where: { runId: data.runId },
            data: { status: "failed" },
        });

        return;
    }

    logger.info("Persisting review result", { verdict: verdict.verdict });

    const enrichedEvidence = verdict.evidence.map((item) => {
        if (item.type === "screenshot" && data.finalScreenshotKey != null) {
            return { ...item, s3Key: data.finalScreenshotKey };
        }
        if (item.type === "video" && data.videoS3Key != null) {
            return { ...item, s3Key: data.videoS3Key };
        }
        return item;
    });

    await db.$transaction(async (tx) => {
        const review = await tx.runReview.update({
            where: { runId: data.runId },
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
            where: { runReviewId: review.id },
            create: {
                runReviewId: review.id,
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
            const run = await tx.run.findUniqueOrThrow({
                where: { id: data.runId },
                select: {
                    assignment: {
                        select: {
                            testCaseId: true,
                            snapshot: { select: { branchId: true } },
                        },
                    },
                },
            });

            await bugLinker.linkIssueToBug(tx, {
                issueId: issue.id,
                issueTitle: verdict.title,
                issueDescription: verdict.reasoning,
                branchId: run.assignment.snapshot.branchId,
                testCaseId: run.assignment.testCaseId,
                severity: verdict.severity,
                organizationId: data.organizationId,
            });
        }

        const costRecords = costCollector.getRecords();
        if (costRecords.length > 0) {
            logger.info("Saving cost records", { count: costRecords.length });
            await tx.aiCostRecord.createMany({
                data: costRecords.map((record) => ({
                    runId: data.runId,
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

    logger.info("Replay review completed successfully", {
        verdict: verdict.verdict,
        runId: data.runId,
    });
}

await runWithSentry({ name: "replay-reviewer", tags: { runId } }, async () => {
    try {
        await main();
    } catch (error) {
        logger.fatal("Replay reviewer failed", error);

        try {
            await db.runReview.update({
                where: { runId },
                data: { status: "failed" },
            });
        } catch (updateError) {
            logger.error("Failed to update review status to failed", updateError);
        }

        throw error;
    }
});

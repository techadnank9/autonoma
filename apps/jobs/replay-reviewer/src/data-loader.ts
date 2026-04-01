import type { PrismaClient } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import type { StorageProvider } from "@autonoma/storage";

export interface RunStepData {
    order: number;
    interaction: string;
    params: unknown;
    output: unknown;
    screenshotBeforeKey?: string;
    screenshotAfterKey?: string;
}

export interface RunReviewData {
    runId: string;
    organizationId: string;
    testPlanPrompt: string;
    testCaseName: string;
    steps: RunStepData[];
    videoS3Key?: string;
    finalScreenshotKey?: string;
}

export class RunDataLoader {
    constructor(
        private readonly db: PrismaClient,
        private readonly storage: StorageProvider,
    ) {}

    async loadRun(runId: string): Promise<RunReviewData> {
        logger.info("Loading run data", { runId });

        const run = await this.db.run.findUniqueOrThrow({
            where: { id: runId },
            select: {
                id: true,
                status: true,
                organizationId: true,
                assignment: {
                    select: {
                        testCase: { select: { name: true } },
                        plan: { select: { prompt: true } },
                    },
                },
                outputs: {
                    select: {
                        list: {
                            select: {
                                order: true,
                                output: true,
                                screenshotBefore: true,
                                screenshotAfter: true,
                                stepInput: {
                                    select: {
                                        interaction: true,
                                        params: true,
                                    },
                                },
                            },
                            orderBy: { order: "asc" },
                        },
                    },
                },
            },
        });

        if (run.status !== "failed") {
            throw new Error(`Run ${runId} has status "${run.status}", expected "failed"`);
        }

        const outputSteps = run.outputs?.list ?? [];

        const steps: RunStepData[] = outputSteps.map((step) => ({
            order: step.order,
            interaction: step.stepInput.interaction,
            params: step.stepInput.params,
            output: step.output,
            screenshotBeforeKey: step.screenshotBefore ?? undefined,
            screenshotAfterKey: step.screenshotAfter ?? undefined,
        }));

        const lastStep = outputSteps[outputSteps.length - 1];
        const finalScreenshotKey = lastStep?.screenshotAfter ?? lastStep?.screenshotBefore ?? undefined;

        const videoS3Key = `run/${runId}/video.webm`;

        logger.info("Run data loaded", { stepCount: steps.length });

        return {
            runId: run.id,
            organizationId: run.organizationId,
            testPlanPrompt: run.assignment.plan?.prompt ?? "No test plan prompt available",
            testCaseName: run.assignment.testCase.name,
            steps,
            videoS3Key,
            finalScreenshotKey,
        };
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

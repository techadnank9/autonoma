import type { GenerationStatus, PrismaClient } from "@autonoma/db";
import { type Logger, logger } from "@autonoma/logger";
import type { WorkflowArchitecture } from "@autonoma/workflow";

export interface GenerationManagerParams {
    snapshotId: string;
    organizationId: string;
    db: PrismaClient;
}

interface SnapshotGeneration {
    id: string;
    status: GenerationStatus;
    stepsId: string | null;
    testPlanId: string;
    createdAt: Date;
    testPlan: {
        testCaseId: string;
        scenario: { id: string } | null;
        testCase: { application: { architecture: string } };
    };
}

const INCOMPLETE_STATUSES: GenerationStatus[] = ["pending", "queued", "running"];

/**
 * Manages the state of generations for a snapshot.
 *
 * All read methods fetch the full list of generations for the snapshot and filter
 * in memory. We expect fewer than 1000 generations per snapshot, so it is safe to
 * load them all at once.
 */
export class GenerationManager {
    private readonly logger: Logger;

    private readonly snapshotId: string;
    private readonly organizationId: string;
    private readonly db: PrismaClient;

    constructor({ snapshotId, organizationId, db }: GenerationManagerParams) {
        this.snapshotId = snapshotId;
        this.organizationId = organizationId;
        this.db = db;
        this.logger = logger.child({ name: this.constructor.name, snapshotId });
    }

    /**
     * Schedule a generation job with the given test plan.
     *
     * This doesn't immediately start the job - it only stores the data for later execution.
     * Deletes any existing pending generations for the same test case before creating the new one.
     */
    async addJob(planId: string) {
        this.logger.info("Adding job to queue", { planId });

        const generations = await this.fetchGenerations();
        const testCaseId = await this.resolveTestCaseId(planId);

        const existingGenerations = generations.filter(
            (gen) => gen.testPlan.testCaseId === testCaseId && gen.status === "pending",
        );

        if (existingGenerations.length > 0) {
            const existingGenerationIds = existingGenerations.map((gen) => gen.id);
            this.logger.info("Found existing pending generations for test case", {
                planId,
                testCaseId,
                existingGenerationIds,
            });

            const generationsWithDifferentPlans = existingGenerations.filter((gen) => gen.testPlanId !== planId);
            if (generationsWithDifferentPlans.length > 0) {
                this.logger.fatal(
                    "Found generations with different test plans for this test case. This is likely an error",
                    { planId },
                );
            }

            this.logger.info("Deleting pending generations for this test case", { planId });
            await this.db.testGeneration.deleteMany({ where: { id: { in: existingGenerationIds } } });
        }

        this.logger.info("Creating generation record", { planId });
        await this.db.testGeneration.create({
            data: {
                testPlanId: planId,
                snapshotId: this.snapshotId,
                organizationId: this.organizationId,
            },
        });
    }

    /** Returns all pending generation records for this snapshot. */
    async getPendingGenerations() {
        const generations = await this.fetchGenerations();

        return generations
            .filter((gen) => gen.status === "pending")
            .map((gen) => ({
                testGenerationId: gen.id,
                planId: gen.testPlanId,
                scenarioId: gen.testPlan.scenario?.id,
                architecture: gen.testPlan.testCase.application.architecture as WorkflowArchitecture,
            }));
    }

    /** Returns the generations matching the given IDs. */
    async getGenerations(generationIds: string[]) {
        const idSet = new Set(generationIds);
        const generations = await this.fetchGenerations();

        return generations.filter((gen) => idSet.has(gen.id));
    }

    /** Marks the given generations as queued. */
    async markAsQueued(generationIds: string[]) {
        this.logger.info("Marking generations as queued", { generationIds });

        await this.db.testGeneration.updateMany({
            where: { id: { in: generationIds }, snapshotId: this.snapshotId },
            data: { status: "queued" },
        });
    }

    /** Deletes a pending generation. Throws if the generation is not pending. */
    async discardGeneration(generationId: string) {
        this.logger.info("Discarding generation", { generationId });

        const generation = await this.db.testGeneration.findUnique({
            where: { id: generationId, snapshotId: this.snapshotId },
            select: { status: true },
        });

        if (generation == null) {
            throw new Error(`Generation ${generationId} not found for snapshot ${this.snapshotId}`);
        }

        if (generation.status !== "pending") {
            throw new Error(
                `Cannot discard generation ${generationId}: status is "${generation.status}", expected "pending"`,
            );
        }

        await this.db.testGeneration.delete({ where: { id: generationId } });
        this.logger.info("Generation discarded", { generationId });
    }

    /** Returns true if there are any incomplete (pending, queued, or running) generations for this snapshot. */
    async hasIncompleteGenerations() {
        const generations = await this.fetchGenerations();

        return generations.some((gen) => INCOMPLETE_STATUSES.includes(gen.status));
    }

    /** Returns the latest generation status per test case for this snapshot. */
    async getGenerationSummary() {
        const generations = await this.fetchGenerations();

        const latestByTestCase = new Map<string, SnapshotGeneration>();
        for (const gen of generations) {
            const existing = latestByTestCase.get(gen.testPlan.testCaseId);
            if (existing == null || gen.createdAt > existing.createdAt)
                latestByTestCase.set(gen.testPlan.testCaseId, gen);
        }

        return Array.from(latestByTestCase.values()).map((gen) => ({
            testCaseId: gen.testPlan.testCaseId,
            generationId: gen.id,
            status: gen.status,
        }));
    }

    /**
     * Fetches all generations for this snapshot.
     *
     * We expect fewer than 1000 generations per snapshot, so it is safe to load
     * them all into memory at once.
     */
    private async fetchGenerations() {
        return this.db.testGeneration.findMany({
            where: { snapshotId: this.snapshotId },
            select: {
                id: true,
                status: true,
                stepsId: true,
                testPlanId: true,
                createdAt: true,
                testPlan: {
                    select: {
                        testCaseId: true,
                        scenario: { select: { id: true } },
                        testCase: { select: { application: { select: { architecture: true } } } },
                    },
                },
            },
        });
    }

    private async resolveTestCaseId(planId: string) {
        const plan = await this.db.testPlan.findUniqueOrThrow({
            where: { id: planId },
            select: { testCaseId: true },
        });
        return plan.testCaseId;
    }
}

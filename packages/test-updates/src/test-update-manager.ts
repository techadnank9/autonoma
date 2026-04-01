import type { PrismaClient } from "@autonoma/db";
import { type Logger, logger } from "@autonoma/logger";
import type { TestSuiteChange } from "./changes";
import type { GenerationJobOptions, GenerationProvider } from "./generation/generation-job-provider";
import type { GenerationManager } from "./generation/generation-manager";
import { SnapshotDraft } from "./snapshot-draft";

export class MissingJobProviderError extends Error {
    constructor() {
        super("Cannot queue generations without a job provider");
        this.name = "MissingJobProviderError";
    }
}

export class IncompleteGenerationsError extends Error {
    constructor(snapshotId: string) {
        super(`Cannot finalize snapshot ${snapshotId}: there are still incomplete generations`);
        this.name = "IncompleteGenerationsError";
    }
}

interface TestSuiteUpdaterParams {
    snapshotDraft: SnapshotDraft;
    generationManager: GenerationManager;
    jobProvider?: GenerationProvider;
}

/**
 * The test update manager handles the flow of updating the test suite based on changes
 * that were made to the application.
 */
export class TestSuiteUpdater {
    private readonly logger: Logger;

    private readonly snapshotDraft: SnapshotDraft;
    private readonly generationManager: GenerationManager;
    private readonly jobProvider?: GenerationProvider;

    public get snapshotId() {
        return this.snapshotDraft.snapshotId;
    }

    public get branchId() {
        return this.snapshotDraft.branchId;
    }

    private constructor({ snapshotDraft, generationManager, jobProvider }: TestSuiteUpdaterParams) {
        this.logger = logger.child({ name: this.constructor.name, snapshotId: snapshotDraft.snapshotId });
        this.snapshotDraft = snapshotDraft;
        this.generationManager = generationManager;
        this.jobProvider = jobProvider;
    }

    public get headSha(): string | undefined {
        return this.snapshotDraft.headSha;
    }

    public get baseSha(): string | undefined {
        return this.snapshotDraft.baseSha;
    }

    /**
     * Creates a new pending snapshot and returns an updater for it.
     *
     * @param params.jobProvider - Optional. Required only if `queuePendingGenerations` will be called.
     * @param params.organizationId - Optional. When provided, verifies the branch belongs to this organization.
     */
    public static async startUpdate(params: {
        db: PrismaClient;
        branchId: string;
        jobProvider?: GenerationProvider;
        organizationId?: string;
    }) {
        const { db, branchId, jobProvider, organizationId } = params;
        const snapshotDraft = await SnapshotDraft.start({ db, branchId, organizationId });
        const generationManager = snapshotDraft.generationManager();

        return new TestSuiteUpdater({ snapshotDraft, generationManager, jobProvider });
    }

    /**
     * Loads the existing pending snapshot and returns an updater for it.
     *
     * @param params.jobProvider - Optional. Required only if `queuePendingGenerations` will be called.
     * @param params.organizationId - Optional. When provided, verifies the branch belongs to this organization.
     */
    public static async continueUpdate(params: {
        db: PrismaClient;
        branchId: string;
        jobProvider?: GenerationProvider;
        organizationId?: string;
    }) {
        const { db, branchId, jobProvider, organizationId } = params;
        const snapshotDraft = await SnapshotDraft.loadPending({ db, branchId, organizationId });
        const generationManager = snapshotDraft.generationManager();

        return new TestSuiteUpdater({ snapshotDraft, generationManager, jobProvider });
    }

    public async currentTestSuiteInfo() {
        return this.snapshotDraft.currentTestSuiteInfo();
    }

    public async apply(change: TestSuiteChange) {
        this.logger.info("Applying test suite change", { type: change.constructor.name });

        await change.apply({ snapshotDraft: this.snapshotDraft, generationManager: this.generationManager });

        this.logger.info("Finished applying change");
    }

    /**
     * Fires generation jobs for all pending generations and marks them as queued.
     *
     * Queries pending generations from the generation manager, fires a job for
     * each one via the job provider, then updates their status to "queued".
     *
     * @throws {MissingJobProviderError} If no job provider was supplied at construction time.
     */
    public async queuePendingGenerations(options?: GenerationJobOptions) {
        if (this.jobProvider == null) throw new MissingJobProviderError();

        const pending = await this.generationManager.getPendingGenerations();

        if (pending.length === 0) {
            this.logger.info("No pending generations to queue");

            if (options?.autoActivate) await this.finalize();

            return;
        }

        this.logger.info("Queueing pending generations", {
            count: pending.length,
            autoActivate: options?.autoActivate,
        });

        try {
            await this.jobProvider.fireJobs(pending, options);
        } catch (error) {
            this.logger.fatal("Failed to queue pending generations", error, {
                count: pending.length,
                generationIds: pending.map((g) => g.testGenerationId),
                autoActivate: options?.autoActivate,
            });
            throw error;
        }

        await this.generationManager.markAsQueued(pending.map((g) => g.testGenerationId));

        this.logger.info("Pending generations queued", { count: pending.length });
    }

    /**
     * Assigns generation results to the snapshot.
     *
     * Loads completed generations, assigns step input lists from successful ones
     * to the corresponding test case assignments.
     * Failed generations are skipped (their assignments keep stepsId as null).
     */
    public async assignGenerationResults(generationIds: string[]) {
        this.logger.info("Assigning generation results", { generationIds });

        const generations = await this.generationManager.getGenerations(generationIds);

        const successfulUpdates: Array<{ testCaseId: string; stepsId: string }> = [];
        let failed = 0;

        for (const generation of generations) {
            if (generation.status === "success" && generation.stepsId != null) {
                this.logger.info("Generation succeeded", {
                    generationId: generation.id,
                    testCaseId: generation.testPlan.testCaseId,
                    stepsId: generation.stepsId,
                });
                successfulUpdates.push({
                    testCaseId: generation.testPlan.testCaseId,
                    stepsId: generation.stepsId,
                });
            } else {
                this.logger.warn("Skipping failed generation", {
                    generationId: generation.id,
                    status: generation.status,
                });
                failed++;
            }
        }

        if (successfulUpdates.length > 0) {
            await this.snapshotDraft.updateManySteps(successfulUpdates);
        }

        this.logger.info("Generation results assigned", { assigned: successfulUpdates.length, failed });

        return { assigned: successfulUpdates.length, failed };
    }

    /** Discards a single pending generation by ID. */
    public async discardGeneration(generationId: string) {
        this.logger.info("Discarding generation", { generationId });
        await this.generationManager.discardGeneration(generationId);
        this.logger.info("Generation discarded", { generationId });
    }

    public async getChanges() {
        return this.snapshotDraft.getChanges();
    }

    public async getGenerationSummary() {
        return this.generationManager.getGenerationSummary();
    }

    /** Discards the pending snapshot, removing all assignments and generations. */
    public async discard() {
        this.logger.info("Discarding snapshot");
        await this.snapshotDraft.discard();
        this.logger.info("Snapshot discarded");
    }

    /**
     * Finalizes the snapshot by activating it.
     *
     * Validates that there are no incomplete (pending, queued, or running)
     * generations before activation.
     *
     * @throws {IncompleteGenerationsError} If there are still incomplete generations on this snapshot.
     */
    public async finalize() {
        this.logger.info("Finalizing snapshot");

        const hasIncomplete = await this.generationManager.hasIncompleteGenerations();
        if (hasIncomplete) {
            this.logger.fatal("Cannot finalize snapshot with incomplete generations");
            throw new IncompleteGenerationsError(this.snapshotDraft.snapshotId);
        }

        await this.snapshotDraft.activate();
        this.logger.info("Snapshot finalized and activated");
    }
}

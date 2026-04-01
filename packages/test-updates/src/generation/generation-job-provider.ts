import type { WorkflowArchitecture } from "@autonoma/workflow";

export interface PendingGeneration {
    testGenerationId: string;
    planId: string;
    scenarioId: string | undefined;
    architecture: WorkflowArchitecture;
}

export interface GenerationJobOptions {
    autoActivate?: boolean;
}

export interface GenerationProvider {
    fireJobs(generations: PendingGeneration[], options?: GenerationJobOptions): Promise<void>;
}

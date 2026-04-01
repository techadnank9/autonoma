import type { GenerationProvider, PendingGeneration } from "./generation-job-provider";

export class FakeGenerationProvider implements GenerationProvider {
    public readonly firedBatches: PendingGeneration[][] = [];

    async fireJobs(generations: PendingGeneration[]) {
        this.firedBatches.push(generations);
    }
}

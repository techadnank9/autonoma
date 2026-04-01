import { type Logger, logger } from "@autonoma/logger";
import { triggerBatchGeneration } from "@autonoma/workflow";
import type { GenerationJobOptions, GenerationProvider, PendingGeneration } from "./generation-job-provider";

interface ArgoGenerationProviderParams {
    agentVersion: string;
}

export class ArgoGenerationProvider implements GenerationProvider {
    private readonly logger: Logger;

    private readonly agentVersion: string;

    constructor({ agentVersion }: ArgoGenerationProviderParams) {
        this.logger = logger.child({ name: this.constructor.name });
        this.agentVersion = agentVersion;
    }

    async fireJobs(generations: PendingGeneration[], options?: GenerationJobOptions) {
        const firstGeneration = generations[0];
        if (firstGeneration == null) return;

        const architecture = firstGeneration.architecture;
        const testGenerationIds = generations.map((g) => g.testGenerationId);
        this.logger.info("Firing batch generation workflow", {
            testGenerationIds,
            architecture,
            autoActivate: options?.autoActivate,
        });

        await triggerBatchGeneration({
            testPlans: generations.map((g) => ({
                testGenerationId: g.testGenerationId,
                scenarioId: g.scenarioId,
            })),
            agentVersion: this.agentVersion,
            architecture,
            autoActivate: options?.autoActivate,
        });

        this.logger.info("Batch generation workflow fired", { testGenerationIds });
    }
}

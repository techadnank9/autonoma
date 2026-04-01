import type { CommandSpec } from "../../commands";
import type { BaseCommandContext } from "../../platform";
import { ArtifactWriter, ExecutionAgentRunner, type ExecutionAgentRunnerConfig, getRunDirectory } from "../runner";
import { loadTestCase } from "./load-test-case";

export interface LocalRunnerConfig<TSpec extends CommandSpec, TApplicationData, TContext extends BaseCommandContext>
    extends ExecutionAgentRunnerConfig<TSpec, TApplicationData, TContext> {
    /** Video extension for the artifacts */
    videoExtension: string;
}

export class LocalRunner<
    TSpec extends CommandSpec,
    TApplicationData,
    TContext extends BaseCommandContext,
> extends ExecutionAgentRunner<TSpec, TApplicationData, TContext> {
    private readonly videoExtension: string;

    constructor({ videoExtension, ...config }: LocalRunnerConfig<TSpec, TApplicationData, TContext>) {
        super(config);
        this.videoExtension = videoExtension;
    }

    /**
     * Executes a test case defined locally
     */
    public async runLocalExecution(testCasePath: string): Promise<void> {
        this.logger.info("Loading test case", { testCasePath });
        const testCase = await loadTestCase(testCasePath, this.config.installer.paramsSchema);
        this.logger.info("Test case loaded", { testCase: testCase.name });

        await this.setupAgent(testCase, testCase.prompt);

        const { result: executionResult, videoPath } = await this.run();

        const runDirectory = getRunDirectory(testCase.name);
        this.logger.info("Saving artifacts", { directory: runDirectory });

        new ArtifactWriter(runDirectory, {
            videoExtension: this.videoExtension,
        }).saveAll({
            executionResult,
            instruction: testCase.prompt,
            videoPath,
        });

        this.logger.info("Artifacts saved");
    }
}

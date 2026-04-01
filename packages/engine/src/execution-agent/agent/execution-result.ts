import type { Screenshot } from "@autonoma/image";
import type { ModelMessage } from "ai";
import type { CommandSpec } from "../../commands";
import type { AgentExecutionOutput } from "./tools/command-tool";

export type StepMetadata = { screenshot: Screenshot } & Record<string, unknown>;

/**
 * The result of a single step execution.
 *
 * ! WARNING: Avoid sending this object through the network, since it may contain screenshot data.
 */
export type GeneratedStep<TSpec extends CommandSpec> = {
    /** The output of the step execution */
    executionOutput: AgentExecutionOutput<TSpec>;

    /** The wait condition generated for this step, if any */
    waitCondition?: string;

    /** The metadata from before the step execution */
    beforeMetadata: StepMetadata;

    /** The metadata from after the step execution */
    afterMetadata: StepMetadata;
};

export interface ExecutionResult<TSpec extends CommandSpec> {
    /** The results of the steps that were executed */
    generatedSteps: GeneratedStep<TSpec>[];

    /** The final state of the agent's memory (extracted variables) */
    memory: Record<string, string>;

    /** Whether the execution completed successfully */
    success: boolean;

    /** The reason for completion (success, max steps reached, error) */
    finishReason: "success" | "max_steps" | "error";

    /** Reasoning provided by the model when finishing */
    reasoning?: string;

    /** The screenshot taken at the start of the final agent iteration - what the model saw when it decided to finish */
    finalScreenshot?: Screenshot;

    /** Conversation steps from the model */
    conversation: ModelMessage[];
}

export type LeanGeneratedStep<TSpec extends CommandSpec> = Omit<
    GeneratedStep<TSpec>,
    "beforeMetadata" | "afterMetadata"
>;

/**
 * A lean version of the execution result, capable of being serialized and sent over the network.
 *
 * It excludes the before/after metadata from the generated steps, since they contain large images that are not needed for the client.
 */
export type LeanExecutionResult<TSpec extends CommandSpec = CommandSpec> = Omit<
    ExecutionResult<TSpec>,
    "generatedSteps"
> & {
    // Exclude the before/after metadata from the generated steps - They contain large images that are not needed for the client.
    generatedSteps: LeanGeneratedStep<TSpec>[];
};

export function toLeanStep<TSpec extends CommandSpec>({
    beforeMetadata: _beforeMetadata,
    afterMetadata: _afterMetadata,
    ...step
}: GeneratedStep<TSpec>): LeanGeneratedStep<TSpec> {
    return step;
}

export function toLeanResult<TSpec extends CommandSpec>(result: ExecutionResult<TSpec>): LeanExecutionResult<TSpec> {
    return {
        ...result,
        generatedSteps: result.generatedSteps.map(toLeanStep),
    };
}

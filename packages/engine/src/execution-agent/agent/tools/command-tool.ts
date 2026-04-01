import { type Logger, logger } from "@autonoma/logger";
import { tool } from "ai";
import type z from "zod";
import type { Command, CommandOutput, CommandParams, CommandSpec, StepData } from "../../../commands";
import type { BaseCommandContext } from "../../../platform";
import type { MemoryStore } from "../memory";
import { resolveVariables } from "../memory";

export type AgentExecutionOutput<TSpec extends CommandSpec> = {
    [K in TSpec["interaction"]]: {
        stepData: StepData<Extract<TSpec, { interaction: K }>>;
        result: CommandOutput<Extract<TSpec, { interaction: K }>>;
    };
}[TSpec["interaction"]];

interface CommandToolConfig<TSpec extends CommandSpec, TContext extends BaseCommandContext, TInput> {
    /** Get the context for the command. */
    getContext: () => TContext;

    /** Get the agent's memory store for variable resolution. */
    getMemory: () => MemoryStore;

    /** Execute the command. */
    // Method shorthand intentional: bivariant checking lets broader context types (e.g. WebContext)
    // be passed to tools that declare a narrower context (e.g. ClickCommandContext).
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    beforeExecute(input: TInput, context: TContext): Promise<void>;

    /** After the command has been executed. */
    // eslint-disable-next-line @typescript-eslint/method-signature-style
    afterExecute(input: TInput, output: AgentExecutionOutput<TSpec>, context: TContext): Promise<void>;
}

function toolFailure(error: Error) {
    return { success: false, error: error.message };
}

function toolSuccess<TOutput>(result: TOutput) {
    return { success: true, result };
}

/**
 * Command tools are tools that execute commands. These are stored as steps in the test.
 *
 * These classes are light wrappers around the {@link Command} class to make them compatible with the AI SDK.
 * They enable the possibility of allowing the tool inputs to differ from the parameters (though, in most cases, they will be the same)
 * that are then stored in the database.
 */
export abstract class CommandTool<
    TSpec extends CommandSpec,
    TContext extends BaseCommandContext,
    TInput = CommandParams<TSpec>,
> {
    protected readonly logger: Logger;

    /** The schema of the input of the tool. */
    protected abstract inputSchema(): z.ZodSchema<TInput>;

    /** The description of the tool. */
    abstract description(): string;

    constructor(protected readonly command: Command<TSpec, TContext>) {
        this.logger = logger.child({ name: this.constructor.name });
    }

    get interaction(): TSpec["interaction"] {
        return this.command.interaction;
    }

    /** Converts the input of the tool into the parameters of the command. */
    protected abstract extractParams(input: TInput, context: TContext): Promise<CommandParams<TSpec>>;

    /** Convert this command tool into a `Tool` compatible with the AI SDK. */
    toTool({ getContext, getMemory, beforeExecute, afterExecute }: CommandToolConfig<TSpec, TContext, TInput>) {
        return tool({
            description: this.description(),
            inputSchema: this.inputSchema(),
            execute: async (input: TInput) => {
                try {
                    this.logger.info("Reading context for command call...");
                    const context = getContext();

                    await beforeExecute(input, context);

                    this.logger.info("Extracting parameters for command...", { input });
                    const params = await this.extractParams(input, context);

                    // Resolve {{variableName}} templates from the agent's memory.
                    // The unresolved `params` are stored for replay; the resolved values are used for execution.
                    const resolvedParams = resolveVariables(params, getMemory());

                    this.logger.info("Executing command...", { params: resolvedParams });
                    const executeOutput = await this.command.execute(resolvedParams, context);
                    const executionResult = {
                        stepData: {
                            interaction: this.command.interaction,
                            params,
                        },
                        result: executeOutput,
                    };
                    this.logger.info("Command executed successfully", executionResult);

                    await afterExecute(input, executionResult, context);

                    return toolSuccess(executeOutput);
                } catch (error) {
                    this.logger.error("Error executing command", { error });
                    return toolFailure(error instanceof Error ? error : new Error(String(error)));
                }
            },
        });
    }
}

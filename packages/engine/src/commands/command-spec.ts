interface BaseOutput {
    outcome: string;
}

/**
 * A specification for the interface of a command.
 *
 * This groups the different types of a command into a single interface.
 */
export interface CommandSpec {
    interaction: string;

    /** The parameters that will be stored to execute the step. */
    params: object;

    /** The result of executing the command. */
    output: BaseOutput;
}

export type CommandParams<TSpec extends CommandSpec> = TSpec["params"];
export type CommandOutput<TSpec extends CommandSpec> = TSpec["output"];

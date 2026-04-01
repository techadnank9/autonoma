import type { CommandParams, CommandSpec } from "./command-spec";

/**
 * The data needed to reproduce a step.
 *
 * This is usually stored in the database.
 */
export type StepData<TSpec extends CommandSpec = CommandSpec> = {
    [K in TSpec["interaction"]]: {
        interaction: K;
        params: CommandParams<Extract<TSpec, { interaction: K }>>;
    };
}[TSpec["interaction"]];

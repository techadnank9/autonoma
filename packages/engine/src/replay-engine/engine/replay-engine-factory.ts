import { type Logger, logger } from "@autonoma/logger";
import type { Command, CommandSpec } from "../../commands";
import type { BaseCommandContext } from "../../platform";
import { ReplayEngine } from "./replay-engine";
import type { ReplayEventHandlers } from "./replay-events";
import type { WaitConditionChecker } from "./wait-condition-checker";

/**
 * The "static" configuration for the factory — things that don't change per-run.
 *
 * This mirrors the separation in {@link ExecutionAgentFactory} between static config
 * (set at construction) and runtime params (passed to {@link buildEngine}).
 */
export interface ReplayEngineFactoryConfig<TSpec extends CommandSpec, TContext extends BaseCommandContext> {
    commands: Command<TSpec, TContext>[];
}

/**
 * The "runtime" parameters — things that are only available after the installer runs.
 */
export interface BuildReplayEngineParams<TSpec extends CommandSpec, TContext extends BaseCommandContext> {
    context: TContext;
    waitChecker: WaitConditionChecker;
    eventHandlers: ReplayEventHandlers<TSpec>;
}

/**
 * Factory for building {@link ReplayEngine} instances.
 *
 * Separates static configuration (commands, built from a model registry) from runtime
 * parameters (context, wait checker) that are only available after the installer runs.
 */
export class ReplayEngineFactory<TSpec extends CommandSpec, TContext extends BaseCommandContext> {
    protected readonly logger: Logger;

    constructor(protected readonly config: ReplayEngineFactoryConfig<TSpec, TContext>) {
        this.logger = logger.child({ name: this.constructor.name });
    }

    buildEngine(params: BuildReplayEngineParams<TSpec, TContext>): ReplayEngine<TSpec, TContext> {
        this.logger.info("Building replay engine", { commandCount: this.config.commands.length });

        return new ReplayEngine({
            commands: this.config.commands,
            ...params,
        });
    }
}

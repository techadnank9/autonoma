import type { Screenshot } from "@autonoma/image";
import { type Logger, logger } from "@autonoma/logger";
import type { Command, CommandOutput, CommandSpec } from "../../commands";
import { MemoryStore, resolveVariables } from "../../execution-agent/agent/memory";
import type { BaseCommandContext } from "../../platform";
import type { ReplayEventHandlers } from "./replay-events";
import type { ReplayStep, ReplayStepResult } from "./replay-step";
import type { WaitConditionChecker } from "./wait-condition-checker";

export interface ReplayEngineConfig<TSpec extends CommandSpec, TContext extends BaseCommandContext> {
    commands: Command<TSpec, TContext>[];
    context: TContext;
    waitChecker: WaitConditionChecker;
    eventHandlers: ReplayEventHandlers<TSpec>;
    memory?: MemoryStore;
}

type CommandMap<TSpec extends CommandSpec, TContext extends BaseCommandContext> = {
    [K in TSpec["interaction"]]: Command<Extract<TSpec, { interaction: K }>, TContext>;
};

export interface ReplayState<TSpec extends CommandSpec> {
    executedSteps: ReplayStep<TSpec>[];
    executionResults: ReplayStepResult<TSpec>[];
}

/** The result of the entire replay execution. */
export interface ReplayResult<TSpec extends CommandSpec> {
    state: ReplayState<TSpec>;
    success: boolean;
    reasoning?: string;
}

export class ReplayEngine<TSpec extends CommandSpec, TContext extends BaseCommandContext> {
    private readonly logger: Logger;

    private readonly context: TContext;
    private readonly commandMap: CommandMap<TSpec, TContext>;
    private readonly waitChecker: WaitConditionChecker;
    private readonly eventHandlers: ReplayEventHandlers<TSpec>;
    private readonly memory: MemoryStore;

    /** The steps that have been executed so far. */
    private readonly executedSteps: ReplayStep<TSpec>[] = [];
    /** The results of the steps that have been executed so far. */
    private readonly executionResults: ReplayStepResult<TSpec>[] = [];

    constructor(config: ReplayEngineConfig<TSpec, TContext>) {
        this.logger = logger.child({ name: "ReplayEngine" });

        this.context = config.context;
        this.waitChecker = config.waitChecker;
        this.eventHandlers = config.eventHandlers;
        this.memory = config.memory ?? new MemoryStore();

        this.commandMap = config.commands.reduce(
            (map, command) => {
                map[command.interaction] = command as Command<
                    Extract<TSpec, { interaction: typeof command.interaction }>,
                    TContext
                >;
                return map;
            },
            {} as { [K in TSpec["interaction"]]: Command<TSpec, TContext> },
        ) as CommandMap<TSpec, TContext>;
    }

    public getState(): ReplayState<TSpec> {
        return {
            executedSteps: this.executedSteps,
            executionResults: this.executionResults,
        };
    }

    /** Execute the given steps in order, returning the final result */
    public async replay(steps: ReplayStep<TSpec>[]): Promise<ReplayResult<TSpec>> {
        this.logger.info("Starting replay execution", { stepCount: steps.length });

        for (const [index, step] of steps.entries()) {
            const result = await this.executeStep(step, index);

            if (result.status === "failed") {
                this.logger.warn("Step failed, skipping remaining steps", {
                    failedStepIndex: index,
                    remainingSteps: steps.length - index - 1,
                });

                const reasoning = result.error?.message ?? `Step ${index + 1} failed`;
                return { success: false, state: this.getState(), reasoning };
            }
        }

        this.logger.info("Replay execution completed successfully", { stepCount: steps.length });
        return { success: true, state: this.getState() };
    }

    /** Wait for step to complete */
    private async waitForStep({ stepData, waitCondition }: ReplayStep<TSpec>): Promise<void> {
        const { application } = this.context;

        const startTime = Date.now();
        this.logger.info("Waiting for step", { interaction: stepData.interaction, waitCondition });

        await Promise.all([
            application.waitUntilStable(),
            waitCondition != null ? this.waitChecker.waitForCondition(waitCondition) : Promise.resolve(),
        ]);

        this.logger.info("Step waited", {
            interaction: stepData.interaction,
            waitCondition,
            duration: Date.now() - startTime,
        });
    }

    /** Execute a single step */
    private async executeStep(step: ReplayStep<TSpec>, stepIndex: number): Promise<ReplayStepResult<TSpec>> {
        const { screen } = this.context;

        const { interaction } = step.stepData;
        this.logger.info("Executing step", { stepIndex, interaction });

        let screenshotBefore: Screenshot | undefined = undefined;

        try {
            await this.beforeStep(step);

            screenshotBefore = await screen.screenshot();

            const command = this.commandMap[interaction];
            if (command == null) throw new Error(`Unknown command: "${interaction}"`);

            this.logger.info("Executing command", { stepIndex, interaction, command: command.constructor.name });
            const resolvedParams = resolveVariables(step.stepData.params, this.memory);
            const output = (await command.execute(resolvedParams, this.context)) as CommandOutput<TSpec>;

            this.logger.info("Step executed successfully", { stepIndex, interaction });

            const result = {
                step,
                status: "passed" as const,
                output,
                screenshotBefore,
                screenshotAfter: await this.safeScreenshot(),
            };

            await this.afterStep(step, result);

            return result;
        } catch (error) {
            this.logger.error("Step execution failed", { stepIndex, interaction, error });

            const screenshotOnFailure = await this.safeScreenshot();

            const result = {
                step,
                status: "failed" as const,
                error: error instanceof Error ? error : new Error(String(error)),
                screenshotBefore: screenshotBefore,
                screenshotAfter: screenshotOnFailure,
            };

            await this.afterStep(step, result);

            return result;
        }
    }

    /** Take a screenshot, returning null if it fails (this method never throws) */
    private async safeScreenshot(): Promise<Screenshot | undefined> {
        try {
            return await this.context.screen.screenshot();
        } catch (error) {
            this.logger.error("Failed to take screenshot", error);
            return undefined;
        }
    }

    /** Called before a step is executed */
    private async beforeStep(step: ReplayStep<TSpec>): Promise<void> {
        const { index, stepData } = step;
        const { interaction } = stepData;

        this.logger.info("Before step execution", { index, interaction });

        await this.eventHandlers.beforeStep({ step, state: this.getState() });

        await this.waitForStep(step);
    }

    /** Called after a step is executed */
    private async afterStep(step: ReplayStep<TSpec>, result: ReplayStepResult<TSpec>): Promise<void> {
        const { index, stepData } = step;
        const { interaction } = stepData;

        this.logger.info("After step execution", { index, interaction });

        this.executionResults.push(result);
        this.executedSteps.push(step);

        await this.eventHandlers.afterStep({ step, result, state: this.getState() });
    }
}

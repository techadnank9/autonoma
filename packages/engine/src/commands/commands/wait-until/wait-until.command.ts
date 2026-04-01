import type { VisualConditionChecker } from "@autonoma/ai";
import type { BaseCommandContext } from "../../../platform";
import { Command } from "../../command";
import type { CommandParams } from "../../command-spec";
import { type WaitUntilCommandSpec, waitUntilParamsSchema } from "./wait-until.def";

const POLL_INTERVAL = 1000;

function wait(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export class WaitUntilTimeoutError extends Error {
    constructor(
        public readonly condition: string,
        public readonly reasoning: string,
    ) {
        super(`The wait until command timed out. Condition "${condition}" not met: ${reasoning}.`);
    }
}

export class WaitUntilCommand extends Command<WaitUntilCommandSpec, BaseCommandContext> {
    public readonly interaction = "wait-until" as const;
    public readonly paramsSchema = waitUntilParamsSchema;

    constructor(private readonly visualConditionChecker: VisualConditionChecker) {
        super();
    }

    async execute({ condition, timeout }: CommandParams<WaitUntilCommandSpec>, { screen }: BaseCommandContext) {
        this.logger.info("Executing wait-until command", { condition, timeout });

        const maxTries = Math.ceil(timeout / POLL_INTERVAL);
        let lastReasoning: string | undefined;

        for (let tries = 0; tries < maxTries; tries++) {
            const screenshot = await screen.screenshot();
            const { metCondition, reason } = await this.visualConditionChecker.checkCondition(condition, screenshot);
            lastReasoning = reason;

            if (metCondition) {
                this.logger.info("Condition met", { tries, reason });
                return {
                    outcome: `Condition met: ${reason}`,
                    reasoning: reason,
                    conditionMet: true,
                };
            }

            this.logger.info("Condition not met, waiting...", { tries, reason });
            await wait(POLL_INTERVAL);
        }

        this.logger.warn("Wait until timed out", { condition, lastReasoning });
        throw new WaitUntilTimeoutError(condition, lastReasoning ?? "No reason provided");
    }
}

import type { VisualConditionChecker } from "@autonoma/ai";
import { type Logger, logger } from "@autonoma/logger";
import type { ScreenDriver } from "../../platform";

export class WaitConditionTimeoutError extends Error {
    constructor(condition: string, timeoutMs: number) {
        super(`Wait condition timed out after ${timeoutMs}ms: "${condition}"`);
        this.name = "WaitConditionTimeoutError";
    }
}

export class WaitConditionChecker {
    private readonly logger: Logger;

    constructor(
        private readonly conditionChecker: VisualConditionChecker,
        private readonly screen: ScreenDriver,
        private readonly intervalMs: number = 1000,
        private readonly timeoutMs: number = 30000,
    ) {
        this.logger = logger.child({ name: "WaitConditionChecker" });
    }

    async waitForCondition(condition: string): Promise<void> {
        this.logger.info("Waiting for condition", { condition, timeoutMs: this.timeoutMs });

        const startTime = Date.now();

        while (Date.now() - startTime < this.timeoutMs) {
            const screenshot = await this.screen.screenshot();
            this.logger.info("Checking condition", { condition });
            const result = await this.conditionChecker.checkCondition(condition, screenshot);
            this.logger.info(`Condition ${result.metCondition ? "met" : "not met"}`, { reason: result.reason });

            if (result.metCondition) return;

            await sleep(this.intervalMs);
        }

        this.logger.warn("Wait condition timed out", { condition, timeoutMs: this.timeoutMs });
        throw new WaitConditionTimeoutError(condition, this.timeoutMs);
    }
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

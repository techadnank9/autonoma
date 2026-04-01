import type { Screenshot } from "@autonoma/image";
import type { CommandOutput, CommandSpec, StepData } from "../../commands";

/** A step to be replayed — corresponds to a TestStep row. */
export interface ReplayStep<TSpec extends CommandSpec> {
    index: number;
    stepData: StepData<TSpec>;
    waitCondition?: string;
}

/** The result of executing a single replay step. */
export interface ReplayStepResult<TSpec extends CommandSpec> {
    step: ReplayStep<TSpec>;
    status: "passed" | "failed";
    output?: CommandOutput<TSpec>;
    error?: Error;
    screenshotBefore?: Screenshot;
    screenshotAfter?: Screenshot;
}

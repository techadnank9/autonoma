import type { CommandSpec } from "../../commands";
import type { ExecutionState } from "../agent";

export interface CurrentStepData {
    name: string;
    input: unknown;
}

interface BeforeStepData<TSpec extends CommandSpec> {
    state: ExecutionState<TSpec>;
}

interface AfterStepData<TSpec extends CommandSpec> {
    state: ExecutionState<TSpec>;
}

/** Events emitted by the headless runner */
export interface RunnerEventHandlers<TSpec extends CommandSpec> {
    /** Emitted before a step is executed */
    beforeStep: (beforeStepData: BeforeStepData<TSpec>) => Promise<void>;
    /** Emitted after a step is executed */
    afterStep: (afterStepData: AfterStepData<TSpec>) => Promise<void>;
    /** Emitted when a frame is captured */
    frame: (base64Image: string) => Promise<void>;
}

import type { CommandSpec } from "../../commands";
import type { ReplayState } from "./replay-engine";
import type { ReplayStep, ReplayStepResult } from "./replay-step";

interface EngineEventData<TSpec extends CommandSpec> {
    state: ReplayState<TSpec>;
}

interface BeforeStepData<TSpec extends CommandSpec> extends EngineEventData<TSpec> {
    step: ReplayStep<TSpec>;
}

interface AfterStepData<TSpec extends CommandSpec> extends EngineEventData<TSpec> {
    step: ReplayStep<TSpec>;
    result: ReplayStepResult<TSpec>;
}

export interface ReplayEventHandlers<TSpec extends CommandSpec> {
    beforeStep: (data: BeforeStepData<TSpec>) => Promise<void>;
    afterStep: (data: AfterStepData<TSpec>) => Promise<void>;
    frame: (base64Image: string) => Promise<void>;
}

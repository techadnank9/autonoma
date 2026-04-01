import { type ApplyChangeParams, TestSuiteChange } from "./test-suite-change";

export interface RegenerateStepsParams {
    testCaseId: string;
}

export class RegenerateSteps extends TestSuiteChange<RegenerateStepsParams> {
    async apply({ snapshotDraft, generationManager }: ApplyChangeParams): Promise<void> {
        const { planId } = await snapshotDraft.clearSteps(this.params.testCaseId);

        await generationManager.addJob(planId);
    }
}

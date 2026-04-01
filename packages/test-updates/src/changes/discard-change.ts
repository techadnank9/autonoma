import { type ApplyChangeParams, TestSuiteChange } from "./test-suite-change";

export interface DiscardChangeParams {
    testCaseId: string;
}

export class DiscardChange extends TestSuiteChange<DiscardChangeParams> {
    async apply({ snapshotDraft }: ApplyChangeParams): Promise<void> {
        await snapshotDraft.revertTestCase(this.params.testCaseId);
    }
}

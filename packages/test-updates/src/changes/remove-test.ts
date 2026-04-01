import { type ApplyChangeParams, TestSuiteChange } from "./test-suite-change";

export interface RemoveTestParams {
    testCaseId: string;
}

export class RemoveTest extends TestSuiteChange<RemoveTestParams> {
    async apply({ snapshotDraft }: ApplyChangeParams): Promise<void> {
        await snapshotDraft.removeTestCase(this.params.testCaseId);
    }
}

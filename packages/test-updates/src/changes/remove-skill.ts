import { type ApplyChangeParams, TestSuiteChange } from "./test-suite-change";

export interface RemoveSkillParams {
    skillId: string;
}

export class RemoveSkill extends TestSuiteChange<RemoveSkillParams> {
    async apply({ snapshotDraft }: ApplyChangeParams): Promise<void> {
        await snapshotDraft.removeSkill(this.params.skillId);
    }
}

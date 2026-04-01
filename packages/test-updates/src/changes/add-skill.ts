import { type ApplyChangeParams, TestSuiteChange } from "./test-suite-change";

export interface AddSkillParams {
    name: string;
    description: string;
    plan: string;
}

export class AddSkill extends TestSuiteChange<AddSkillParams> {
    async apply({ snapshotDraft }: ApplyChangeParams): Promise<void> {
        await snapshotDraft.addSkill(this.params);
    }
}

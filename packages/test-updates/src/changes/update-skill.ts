import { type ApplyChangeParams, TestSuiteChange } from "./test-suite-change";

export interface UpdateSkillParams {
    skillId: string;
    plan: string;
}

export class UpdateSkill extends TestSuiteChange<UpdateSkillParams> {
    async apply({ snapshotDraft }: ApplyChangeParams): Promise<void> {
        await snapshotDraft.updateSkillPlan(this.params);
    }
}

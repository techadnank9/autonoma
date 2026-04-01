import type { SkillsConfig } from "../agent/tools/skill-resolver-tool";
import type { PlanData } from "./generation-persister";

/**
 * Build a SkillsConfig from skill assignments fetched in PlanData.
 * Returns undefined if no skills are assigned.
 */
export function buildSkillsConfigFromPlanData(planData: PlanData): SkillsConfig | undefined {
    const skillAssignments = planData.snapshot?.skillAssignments;
    if (skillAssignments == null || skillAssignments.length === 0) return undefined;

    const skillRecord: Record<string, { name: string; description: string; content: string }> = {};

    for (const assignment of skillAssignments) {
        if (assignment.plan == null) continue;

        skillRecord[assignment.skill.slug] = {
            name: assignment.skill.name,
            description: assignment.skill.description,
            content: assignment.plan.content,
        };
    }

    if (Object.keys(skillRecord).length === 0) return undefined;

    return { skillRecord };
}

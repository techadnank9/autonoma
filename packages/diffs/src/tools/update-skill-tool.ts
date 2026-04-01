import { tool } from "ai";
import { z } from "zod";
import type { DiffsAgentCallbacks } from "../callbacks";
import type { ResultCollector } from "./finish-tool";

export const skillUpdateSchema = z.object({
    skillId: z.string().describe("The ID of the skill to update"),
    skillName: z.string().describe("The name of the skill being updated"),
    reasoning: z.string().describe("Why this skill needs updating based on the code changes"),
    newContent: z.string().describe("The updated skill content (full markdown)"),
});

export type SkillUpdate = z.infer<typeof skillUpdateSchema>;

export function buildUpdateSkillTool(callbacks: DiffsAgentCallbacks, collector: ResultCollector) {
    return tool({
        description:
            "Update a skill whose content is outdated because the code changed. " +
            "Skills are reusable sub-flows (e.g. login, checkout) used by tests. " +
            "If the code changes affect a flow that a skill describes, update the skill content.",
        inputSchema: skillUpdateSchema,
        execute: async (input) => {
            collector.skillUpdates.push(input);
            await callbacks.updateSkill(input.skillId, input.newContent);
            return { success: true, skillId: input.skillId };
        },
    });
}

import { logger } from "@autonoma/logger";
import { tool } from "ai";
import z from "zod";

export interface SkillEntry {
    /** Human-readable name of the skill */
    name: string;
    /** Short description of what the skill does — used by the LLM to pick the right skill */
    description: string;
    /** The full skill instructions (markdown body) that tell the agent what actions to perform */
    content: string;
}

export type SkillsRecord = Record<string, SkillEntry>;

export interface SkillsConfig {
    /** Map of skill key to its metadata (name + description) */
    skillRecord: SkillsRecord;
}

function buildSkillsReference(skillRecord: SkillsRecord): string {
    const entries = Object.entries(skillRecord);
    if (entries.length === 0) return "No skills available.";

    return entries.map(([key, { name, description }]) => `- **${key}** — ${name}: ${description}`).join("\n");
}

const skillResolverSchema = z.object({
    skillKey: z
        .string()
        .describe(
            "The key of the skill to resolve. " +
                "This must match one of the skill keys listed in the available skills reference.",
        ),
});

export function buildSkillResolverTool(config: SkillsConfig) {
    const skillsReference = buildSkillsReference(config.skillRecord);

    return tool({
        description:
            // biome-ignore lint/style/useTemplate: Template literals are less readable for multi-line strings in this case
            "Retrieve the full instructions for a reusable skill (sub-flow). " +
            "Use this when a test step references a skill by name (e.g., 'login using skill: login'). " +
            "The skill instructions will tell you exactly what actions to perform. " +
            "After retrieving the skill, execute its steps using the available action tools (click, type, assert, etc.). " +
            "Apply any parameters mentioned in the test step (e.g., credentials, resource names) when following the skill instructions. " +
            "Do NOT call this tool if you already have the skill instructions from a previous call in this session." +
            `\n\nAvailable Skills:\n\n${skillsReference}`,
        inputSchema: skillResolverSchema,
        execute: async (input) => {
            const log = logger.child({ name: "skill-resolver-tool" });
            log.info("Resolving skill", { skillKey: input.skillKey });

            const skill = config.skillRecord[input.skillKey];

            if (skill == null) {
                log.warn("Skill not found", {
                    skillKey: input.skillKey,
                    availableSkills: Object.keys(config.skillRecord),
                });

                throw new Error(`Skill "${input.skillKey}" not found in provided skills config.`);
            }

            log.info("Skill resolved", { skillKey: input.skillKey, skillName: skill.name });

            return { skillKey: input.skillKey, ...skill };
        },
    });
}

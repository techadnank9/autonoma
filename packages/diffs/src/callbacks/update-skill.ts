import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { PrismaClient } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import { type TestSuiteUpdater, UpdateSkill } from "@autonoma/test-updates";

interface UpdateSkillParams {
    skillId: string;
    newContent: string;
}

interface UpdateSkillDeps {
    db: PrismaClient;
    updater: TestSuiteUpdater;
    applicationId: string;
    workingDirectory: string;
}

export async function updateSkill(
    { skillId, newContent }: UpdateSkillParams,
    { db, updater, applicationId, workingDirectory }: UpdateSkillDeps,
): Promise<void> {
    logger.info("Updating skill", { skillId });

    const skill = await db.skill.findFirst({
        where: { id: skillId, applicationId },
        select: { id: true, slug: true, name: true, description: true },
    });

    if (skill == null) {
        logger.warn("Skill not found for update", { skillId });
        return;
    }

    await updater.apply(new UpdateSkill({ skillId: skill.id, plan: newContent }));

    const skillsDir = join(workingDirectory, "autonoma", "skills");
    await mkdir(skillsDir, { recursive: true });
    const skillFileContent = `---\nname: ${skill.name}\ndescription: ${skill.description}\n---\n\n${newContent}`;
    await writeFile(join(skillsDir, `${skill.slug}.md`), skillFileContent, "utf-8");
    logger.info("Skill updated and written to disk", { skillId, dir: skillsDir });
}

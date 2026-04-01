import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { PrismaClient } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import { type TestSuiteUpdater, UpdateTest } from "@autonoma/test-updates";

interface ModifyTestParams {
    slug: string;
    newInstruction: string;
}

interface ModifyTestDeps {
    db: PrismaClient;
    updater: TestSuiteUpdater;
    applicationId: string;
    workingDirectory: string;
}

export async function modifyTest(
    { slug, newInstruction }: ModifyTestParams,
    { db, updater, applicationId, workingDirectory }: ModifyTestDeps,
): Promise<void> {
    logger.info("Modifying test", { slug });

    const testCase = await db.testCase.findFirst({
        where: { slug, applicationId },
        select: { id: true, name: true },
    });

    if (testCase == null) {
        logger.warn("Test case not found for modify", { slug });
        return;
    }

    await updater.apply(new UpdateTest({ testCaseId: testCase.id, plan: newInstruction }));

    const testsDir = join(workingDirectory, "autonoma", "qa-tests");
    await mkdir(testsDir, { recursive: true });
    const testFileContent = `---\nname: ${testCase.name}\n---\n\n${newInstruction}`;
    await writeFile(join(testsDir, `${slug}.md`), testFileContent, "utf-8");
    logger.info("Test modified and written to disk", { slug, dir: testsDir });
}

import { execFile } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { promisify } from "node:util";
import { db } from "@autonoma/db";
import type { DiffsAgentInput, ExistingSkillInfo, ExistingTestInfo } from "@autonoma/diffs";
import { logger } from "@autonoma/logger";
import type { TestSuiteInfo } from "@autonoma/test-updates";

const execFileAsync = promisify(execFile);

export interface BranchData {
    applicationId: string;
    fullName: string;
    installationId: string;
}

export async function loadBranchData(branchId: string): Promise<BranchData> {
    const branch = await db.branch.findUniqueOrThrow({
        where: { id: branchId },
        select: {
            applicationId: true,
            application: {
                select: {
                    githubRepositories: {
                        select: {
                            fullName: true,
                            installationId: true,
                        },
                        take: 1,
                    },
                },
            },
        },
    });

    const repo = branch.application.githubRepositories[0];
    if (repo == null) {
        throw new Error(`No GitHub repository found for application ${branch.applicationId}`);
    }

    return {
        applicationId: branch.applicationId,
        fullName: repo.fullName,
        installationId: repo.installationId,
    };
}

function mapTestSuiteToContext(suiteInfo: TestSuiteInfo): {
    existingTests: ExistingTestInfo[];
    existingSkills: ExistingSkillInfo[];
} {
    const existingTests: ExistingTestInfo[] = [];
    for (const testCase of suiteInfo.testCases) {
        if (testCase.plan == null) continue;
        existingTests.push({
            id: testCase.id,
            name: testCase.name,
            slug: testCase.slug,
            prompt: testCase.plan.prompt,
        });
    }

    const existingSkills: ExistingSkillInfo[] = [];
    for (const skill of suiteInfo.skills) {
        if (skill.plan == null) continue;
        existingSkills.push({
            id: skill.id,
            name: skill.name,
            slug: skill.slug,
            description: skill.description,
            content: skill.plan.content,
        });
    }

    return { existingTests, existingSkills };
}

async function buildDiffAnalysis(
    repoDir: string,
    headSha: string,
    baseSha: string,
): Promise<{ affectedFiles: string[]; summary: string }> {
    const { stdout: nameOnly } = await execFileAsync("git", ["diff", `${baseSha}..${headSha}`, "--name-only"], {
        cwd: repoDir,
        maxBuffer: 10 * 1024 * 1024,
    });

    const affectedFiles = nameOnly
        .trim()
        .split("\n")
        .filter((f) => f.length > 0);

    const { stdout: logOutput } = await execFileAsync("git", ["log", `${baseSha}..${headSha}`, "--format=%s"], {
        cwd: repoDir,
    });

    const summary = logOutput.trim();

    logger.info("Built diff analysis", { affectedFiles: affectedFiles.length, summary: summary.slice(0, 200) });
    return { affectedFiles, summary };
}

async function writeContextToDisk(
    repoDir: string,
    tests: ExistingTestInfo[],
    skills: ExistingSkillInfo[],
): Promise<void> {
    const testsDir = join(repoDir, "autonoma", "qa-tests");
    const skillsDir = join(repoDir, "autonoma", "skills");

    await Promise.all([mkdir(testsDir, { recursive: true }), mkdir(skillsDir, { recursive: true })]);

    const writeOps: Promise<void>[] = [];

    for (const test of tests) {
        const content = `---\nname: ${test.name}\n---\n\n${test.prompt}`;
        writeOps.push(writeFile(join(testsDir, `${test.slug}.md`), content, "utf-8"));
    }

    for (const skill of skills) {
        const content = `---\nname: ${skill.name}\ndescription: ${skill.description}\n---\n\n${skill.content}`;
        writeOps.push(writeFile(join(skillsDir, `${skill.slug}.md`), content, "utf-8"));
    }

    await Promise.all(writeOps);
    logger.info("Wrote context to disk", { tests: tests.length, skills: skills.length });
}

export async function loadDiffsContext(
    suiteInfo: TestSuiteInfo,
    repoDir: string,
    headSha: string,
    baseSha: string,
): Promise<DiffsAgentInput> {
    const { existingTests, existingSkills } = mapTestSuiteToContext(suiteInfo);

    const [analysis] = await Promise.all([
        buildDiffAnalysis(repoDir, headSha, baseSha),
        writeContextToDisk(repoDir, existingTests, existingSkills),
    ]);

    logger.info("Loaded diffs context", {
        existingTests: existingTests.length,
        existingSkills: existingSkills.length,
    });

    return {
        analysis,
        existingTests,
        existingSkills,
    };
}

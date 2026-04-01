import type { PrismaClient } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import type { TestSuiteUpdater } from "@autonoma/test-updates";
import type { TestRunResult } from "../diffs-agent";
import type { BugReport } from "../tools/bug-found-tool";
import { modifyTest } from "./modify-test";
import { type InstallationOctokit, reportBug } from "./report-bug";
import { updateSkill } from "./update-skill";

export interface CreateCallbacksParams {
    db: PrismaClient;
    updater: TestSuiteUpdater;
    applicationId: string;
    workingDirectory: string;
    repoFullName: string;
    headSha: string;
    octokit: InstallationOctokit;
}

export interface DiffsAgentCallbacks {
    triggerTestAndWait(slug: string): Promise<TestRunResult>;
    quarantineTest(slug: string): Promise<void>;
    modifyTest(slug: string, newInstruction: string): Promise<void>;
    updateSkill(skillId: string, newContent: string): Promise<void>;
    reportBug(report: BugReport): Promise<void>;
}

export function createCallbacks({
    db,
    updater,
    applicationId,
    workingDirectory,
    repoFullName,
    headSha,
    octokit,
}: CreateCallbacksParams): DiffsAgentCallbacks {
    const sharedDeps = { db, updater, applicationId, workingDirectory };

    return {
        triggerTestAndWait: async (slug: string): Promise<TestRunResult> => {
            // TODO: Spawn Argo workflow for deterministic test execution and poll for completion
            logger.info("[STUB] triggerTestAndWait", { slug });
            return {
                slug,
                testName: slug,
                success: false,
                finishReason: "success",
                reasoning:
                    "Test execution not yet implemented. Use your best judgment to decide whether or not to edit the test.",
                stepDescriptions: [],
                screenshotUrls: [],
            };
        },

        quarantineTest: async (slug: string): Promise<void> => {
            // TODO: Implement when quarantine model/field is added
            logger.info("[STUB] quarantineTest", { slug });
        },

        modifyTest: (slug, newInstruction) => modifyTest({ slug, newInstruction }, sharedDeps),

        updateSkill: (skillId, newContent) => updateSkill({ skillId, newContent }, sharedDeps),

        reportBug: (report) => reportBug(report, { repoFullName, headSha, octokit }),
    };
}

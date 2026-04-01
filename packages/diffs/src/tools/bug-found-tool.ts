import { tool } from "ai";
import { z } from "zod";
import type { DiffsAgentCallbacks } from "../callbacks";
import type { ResultCollector } from "./finish-tool";

export const bugReportSchema = z.object({
    slug: z.string(),
    testName: z.string(),
    summary: z.string().describe("One-line description of the bug"),
    detailedExplanation: z
        .string()
        .describe(
            "Full context including what the test attempted, where it failed, " +
                "expected vs actual behavior, and any error messages from the test run output",
        ),
    affectedFiles: z.array(z.string()).describe("Files likely containing the bug, identified via codebase exploration"),
    fixPrompt: z
        .string()
        .describe(
            "A self-contained prompt for a coding agent (Claude Code, Cursor, etc.) to find and fix the bug. " +
                "Must include: the bug description, relevant file paths, what the correct behavior should be, " +
                "and concrete guidance on what to change. The recipient should need zero additional context.",
        ),
});

export type BugReport = z.infer<typeof bugReportSchema>;

export function buildBugFoundTool(
    callbacks: DiffsAgentCallbacks,
    completedRuns: Set<string>,
    collector: ResultCollector,
) {
    return tool({
        description:
            "Report a bug INTRODUCED by the PR changes. " +
            "Use this ONLY when a test failed because the PR introduced a genuine code bug (e.g. a validation regex " +
            "that rejects valid input, a broken logic path, a missing null check added by the PR). " +
            "Do NOT use this for pre-existing issues, code quality concerns, or architectural problems " +
            "that existed before the PR. If the test failed because the UI/flow changed, use modify_test instead. " +
            "You MUST run the test first using run_test before calling this tool. " +
            "Provide a comprehensive bug report including a self-contained fix prompt that a coding agent " +
            "(Claude Code, Cursor, etc.) can use to find and fix the bug without any additional context.",
        inputSchema: bugReportSchema,
        execute: async (input) => {
            if (!completedRuns.has(input.slug)) {
                return {
                    error: `Test "${input.slug}" has not been run yet. You must call run_test first before reporting a bug.`,
                };
            }

            collector.bugReports.push(input);
            await callbacks.reportBug(input);
            return { success: true, slug: input.slug };
        },
    });
}

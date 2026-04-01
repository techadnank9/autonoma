import { tool } from "ai";
import { z } from "zod";
import type { DiffsAgentCallbacks } from "../callbacks";
import type { ResultCollector } from "./finish-tool";

export const modifyTestSchema = z.object({
    slug: z.string().describe("The slug of the test case to modify"),
    testName: z.string().describe("The name of the test being modified"),
    reasoning: z.string().describe("Why this test needs modification based on the code changes"),
    newInstruction: z.string().describe("The updated natural language test instruction that reflects the new behavior"),
});

export type ModifyTestInput = z.infer<typeof modifyTestSchema>;

export function buildModifyTestTool(
    callbacks: DiffsAgentCallbacks,
    completedRuns: Set<string>,
    collector: ResultCollector,
) {
    return tool({
        description:
            "Modify a test whose instruction is outdated because the code changed. " +
            "Use this when a test failed because the UI or flow changed, not because of a bug. " +
            "This includes cases where a feature was replaced with a different implementation " +
            "(e.g. pagination replaced with infinite scroll) - rewrite the test for the new equivalent flow. " +
            "Prefer this over quarantine_test unless the entire feature is permanently gone. " +
            "You MUST run the test first using run_test before calling this tool.",
        inputSchema: modifyTestSchema,
        execute: async (input) => {
            if (!completedRuns.has(input.slug)) {
                return {
                    error: `Test "${input.slug}" has not been run yet. You must call run_test first before modifying.`,
                };
            }

            collector.testActions.push({
                type: "modify",
                slug: input.slug,
                testName: input.testName,
                reasoning: input.reasoning,
                newInstruction: input.newInstruction,
            });
            await callbacks.modifyTest(input.slug, input.newInstruction);
            return { success: true, slug: input.slug };
        },
    });
}

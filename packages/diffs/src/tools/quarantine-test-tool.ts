import { tool } from "ai";
import { z } from "zod";
import type { DiffsAgentCallbacks } from "../callbacks";
import type { ResultCollector } from "./finish-tool";

export const quarantineTestSchema = z.object({
    slug: z.string().describe("The slug of the test case to quarantine"),
    testName: z.string().describe("The name of the test being quarantined"),
    reasoning: z
        .string()
        .describe("Why this test should be quarantined (e.g. the tested flow was deleted from the code)"),
});

export type QuarantineTestInput = z.infer<typeof quarantineTestSchema>;

export function buildQuarantineTestTool(
    callbacks: DiffsAgentCallbacks,
    completedRuns: Set<string>,
    collector: ResultCollector,
) {
    return tool({
        description:
            "Quarantine a test whose ENTIRE flow has been permanently deleted from the codebase, " +
            "making the test obsolete with no equivalent flow to rewrite it for. " +
            "This is rare - only use when the feature is completely gone. " +
            "If the feature was replaced or restructured (e.g. pagination replaced with infinite scroll), " +
            "use modify_test instead to adapt the test to the new flow. " +
            "You MUST run the test first using run_test before calling this tool.",
        inputSchema: quarantineTestSchema,
        execute: async (input) => {
            if (!completedRuns.has(input.slug)) {
                return {
                    error: `Test "${input.slug}" has not been run yet. You must call run_test first before quarantining.`,
                };
            }

            collector.testActions.push({
                type: "quarantine",
                slug: input.slug,
                testName: input.testName,
                reasoning: input.reasoning,
            });
            await callbacks.quarantineTest(input.slug);
            return { success: true, slug: input.slug };
        },
    });
}

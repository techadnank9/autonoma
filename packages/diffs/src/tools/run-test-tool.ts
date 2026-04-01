import { tool } from "ai";
import { z } from "zod";
import type { DiffsAgentCallbacks } from "../callbacks";

const runTestSchema = z.object({
    slug: z.string().describe("The slug of the test case to run"),
});

export function buildRunTestTool(callbacks: DiffsAgentCallbacks, completedRuns: Set<string>) {
    return tool({
        description:
            "Run an existing test to check if it still passes after the code changes. " +
            "This triggers actual test execution and waits for the result. " +
            "After running a test, you unlock post-run tools (quarantine_test, bug_found, modify_test) for that test.",
        inputSchema: runTestSchema,
        execute: async (input) => {
            const result = await callbacks.triggerTestAndWait(input.slug);
            completedRuns.add(input.slug);

            return {
                slug: result.slug,
                testName: result.testName,
                success: result.success,
                finishReason: result.finishReason,
                reasoning: result.reasoning,
                stepDescriptions: result.stepDescriptions,
                videoUrl: result.videoUrl,
                screenshotUrls: result.screenshotUrls,
            };
        },
    });
}

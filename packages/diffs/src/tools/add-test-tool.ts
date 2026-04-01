import { tool } from "ai";
import { z } from "zod";

export const generatedTestSchema = z.object({
    name: z.string().describe("Test name"),
    instruction: z.string().describe("Natural language test instruction"),
    url: z.string().optional().describe("URL to navigate to for the test"),
    reasoning: z.string().describe("Why this test was generated based on the diff"),
});

export type GeneratedTest = z.infer<typeof generatedTestSchema>;

export function buildAddTestTool(addedTests: GeneratedTestCollector) {
    return tool({
        description:
            "Add a new test for functionality that has no test coverage. " +
            "Use this when the diff introduces new user-facing behavior that no existing test covers.",
        inputSchema: generatedTestSchema,
        execute: async (input) => {
            addedTests.add(input);
            return { success: true, testName: input.name };
        },
    });
}

export interface GeneratedTestCollector {
    add(test: GeneratedTest): void;
}

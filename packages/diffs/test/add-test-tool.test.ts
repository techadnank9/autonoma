import { describe, expect, it } from "vitest";
import { buildAddTestTool } from "../src/tools";
import type { GeneratedTestCollector } from "../src/tools/add-test-tool";
import { executeTool } from "./execute-tool";

describe("add_test tool", () => {
    it("records a new test suggestion", async () => {
        const collectedTests: Array<{ name: string; instruction: string; url?: string; reasoning: string }> = [];
        const testCollector: GeneratedTestCollector = {
            add: (test) => collectedTests.push(test),
        };
        const tool = buildAddTestTool(testCollector);

        const result = await executeTool<{ success: boolean; testName: string }>(tool, {
            name: "New user registration",
            instruction:
                "Navigate to /signup, fill in name, email, password, click Create Account, assert welcome page",
            url: "https://app.example.com/signup",
            reasoning: "The diff adds a new signup page that has no test coverage",
        });

        expect(result.success).toBe(true);
        expect(result.testName).toBe("New user registration");
        expect(collectedTests).toHaveLength(1);
        expect(collectedTests[0]?.instruction).toContain("/signup");
    });

    it("records multiple tests", async () => {
        const collectedTests: Array<{ name: string; instruction: string; url?: string; reasoning: string }> = [];
        const testCollector: GeneratedTestCollector = {
            add: (test) => collectedTests.push(test),
        };
        const tool = buildAddTestTool(testCollector);

        await executeTool(tool, {
            name: "Test A",
            instruction: "Do A",
            reasoning: "Reason A",
        });
        await executeTool(tool, {
            name: "Test B",
            instruction: "Do B",
            reasoning: "Reason B",
        });

        expect(collectedTests).toHaveLength(2);
    });
});

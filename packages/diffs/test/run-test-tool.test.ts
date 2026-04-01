import { describe, expect, it, vi } from "vitest";
import type { DiffsAgentCallbacks } from "../src/callbacks";
import type { TestRunResult } from "../src/diffs-agent";
import { buildRunTestTool } from "../src/tools/run-test-tool";
import { executeTool } from "./execute-tool";

function createMockCallbacks(result?: Partial<TestRunResult>): DiffsAgentCallbacks {
    const defaultResult: TestRunResult = {
        slug: "login-flow",
        testName: "Login flow",
        success: true,
        finishReason: "success",
        reasoning: "All assertions passed",
        stepDescriptions: ["Navigated to /login", "Entered credentials", "Clicked Sign In"],
        screenshotUrls: [],
        ...result,
    };

    return {
        triggerTestAndWait: vi.fn().mockResolvedValue(defaultResult),
        quarantineTest: vi.fn(),
        modifyTest: vi.fn(),
        updateSkill: vi.fn(),
        reportBug: vi.fn(),
    };
}

describe("run_test tool", () => {
    it("triggers test execution and returns result", async () => {
        const callbacks = createMockCallbacks();
        const completedRuns = new Set<string>();
        const tool = buildRunTestTool(callbacks, completedRuns);

        const result = await executeTool<TestRunResult>(tool, { slug: "login-flow" });

        expect(callbacks.triggerTestAndWait).toHaveBeenCalledWith("login-flow");
        expect(result.slug).toBe("login-flow");
        expect(result.success).toBe(true);
    });

    it("adds test to completedRuns set", async () => {
        const callbacks = createMockCallbacks();
        const completedRuns = new Set<string>();
        const tool = buildRunTestTool(callbacks, completedRuns);

        await executeTool(tool, { slug: "login-flow" });

        expect(completedRuns.has("login-flow")).toBe(true);
    });

    it("returns failed test result", async () => {
        const callbacks = createMockCallbacks({
            slug: "checkout-flow",
            success: false,
            finishReason: "error",
            reasoning: "Button not found",
        });
        const completedRuns = new Set<string>();
        const tool = buildRunTestTool(callbacks, completedRuns);

        const result = await executeTool<TestRunResult>(tool, { slug: "checkout-flow" });

        expect(result.success).toBe(false);
        expect(result.finishReason).toBe("error");
        expect(completedRuns.has("checkout-flow")).toBe(true);
    });
});

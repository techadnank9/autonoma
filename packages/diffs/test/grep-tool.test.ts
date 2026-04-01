import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildGrepTool } from "../src/tools";
import { executeTool } from "./execute-tool";
import { type TestFixture, createTestFixture } from "./setup-fixture";

interface GrepResult {
    matches: string[];
    count: number;
}

describe("grep tool", () => {
    let fixture: TestFixture;
    let grep: ReturnType<typeof buildGrepTool>;

    beforeAll(async () => {
        fixture = await createTestFixture();
        grep = buildGrepTool(fixture.workingDirectory);
    });

    afterAll(async () => {
        await fixture.cleanup();
    });

    it("finds a function definition", async () => {
        const result = await executeTool<GrepResult>(grep, { pattern: "export function add" });

        expect(result.count).toBe(1);
        expect(result.matches[0]).toContain("math.ts");
        expect(result.matches[0]).toContain("export function add");
    });

    it("finds multiple matches across files", async () => {
        const result = await executeTool<GrepResult>(grep, { pattern: "export" });

        expect(result.count).toBeGreaterThanOrEqual(4);
    });

    it("filters by glob pattern", async () => {
        const result = await executeTool<GrepResult>(grep, { pattern: "export", glob: "**/utils/**" });

        expect(result.count).toBe(1);
        expect(result.matches[0]).toContain("logger.ts");
    });

    it("searches within a specific path", async () => {
        const result = await executeTool<GrepResult>(grep, {
            pattern: "class",
            path: `${fixture.workingDirectory}/src/utils`,
        });

        expect(result.count).toBe(1);
        expect(result.matches[0]).toContain("Logger");
    });

    it("returns empty for non-matching pattern", async () => {
        const result = await executeTool<GrepResult>(grep, {
            pattern: "this_pattern_does_not_exist_anywhere",
        });

        expect(result.count).toBe(0);
        expect(result.matches).toEqual([]);
    });

    it("supports regex patterns", async () => {
        const result = await executeTool<GrepResult>(grep, { pattern: "function \\w+\\(a: number" });

        expect(result.count).toBe(2);
    });

    it("includes line numbers in output", async () => {
        const result = await executeTool<GrepResult>(grep, { pattern: "export function subtract" });

        expect(result.count).toBe(1);
        // rg --line-number format: file:line:content
        expect(result.matches[0]).toMatch(/math\.ts:\d+:export function subtract/);
    });
});

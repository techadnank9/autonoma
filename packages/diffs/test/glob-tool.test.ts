import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildGlobTool } from "../src/tools";
import { executeTool } from "./execute-tool";
import { type TestFixture, createTestFixture } from "./setup-fixture";

interface GlobResult {
    matches: string[];
    count: number;
}

describe("glob tool", () => {
    let fixture: TestFixture;
    let glob: ReturnType<typeof buildGlobTool>;

    beforeAll(async () => {
        fixture = await createTestFixture();
        glob = buildGlobTool(fixture.workingDirectory);
    });

    afterAll(async () => {
        await fixture.cleanup();
    });

    it("finds all TypeScript files", async () => {
        const result = await executeTool<GlobResult>(glob, { pattern: "**/*.ts" });

        expect(result.count).toBe(3);
        expect(result.matches).toContain("src/index.ts");
        expect(result.matches).toContain("src/math.ts");
        expect(result.matches).toContain("src/utils/logger.ts");
    });

    it("finds files in a specific directory", async () => {
        const result = await executeTool<GlobResult>(glob, { pattern: "src/utils/*.ts" });

        expect(result.count).toBe(1);
        expect(result.matches).toContain("src/utils/logger.ts");
    });

    it("finds markdown files", async () => {
        const result = await executeTool<GlobResult>(glob, { pattern: "*.md" });

        expect(result.count).toBe(1);
        expect(result.matches).toContain("README.md");
    });

    it("returns empty for non-matching pattern", async () => {
        const result = await executeTool<GlobResult>(glob, { pattern: "**/*.py" });

        expect(result.count).toBe(0);
        expect(result.matches).toEqual([]);
    });

    it("supports custom cwd", async () => {
        const result = await executeTool<GlobResult>(glob, {
            pattern: "*.ts",
            cwd: `${fixture.workingDirectory}/src/utils`,
        });

        expect(result.count).toBe(1);
        expect(result.matches).toContain("logger.ts");
    });
});

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildReadFileTool } from "../src/tools/read-file-tool";
import { executeTool } from "./execute-tool";
import { type TestFixture, createTestFixture } from "./setup-fixture";

interface ReadFileResult {
    path: string;
    content: string;
    totalLines: number;
    linesShown: number;
    startLine: number;
    endLine: number;
}

interface ReadFileError {
    error: string;
}

describe("read file tool", () => {
    let fixture: TestFixture;
    let readFile: ReturnType<typeof buildReadFileTool>;

    beforeAll(async () => {
        fixture = await createTestFixture();
        readFile = buildReadFileTool(fixture.workingDirectory);
    });

    afterAll(async () => {
        await fixture.cleanup();
    });

    it("reads a file with line numbers", async () => {
        const result = await executeTool<ReadFileResult>(readFile, { filePath: "src/math.ts" });

        expect(result.path).toBe("src/math.ts");
        expect(result.content).toContain("export function add");
        expect(result.content).toContain("export function subtract");
        expect(result.totalLines).toBe(8);
        expect(result.linesShown).toBe(8);
        expect(result.startLine).toBe(1);
        expect(result.endLine).toBe(8);
    });

    it("prepends line numbers to each line", async () => {
        const result = await executeTool<ReadFileResult>(readFile, { filePath: "src/math.ts" });
        const lines = result.content.split("\n");

        expect(lines[0]).toMatch(/^1\t/);
        expect(lines[1]).toMatch(/^2\t/);
    });

    it("reads a file with offset", async () => {
        const result = await executeTool<ReadFileResult>(readFile, { filePath: "src/math.ts", offset: 4 });

        expect(result.startLine).toBe(5);
        expect(result.content).toContain("export function subtract");
        expect(result.content).not.toContain("export function add");
    });

    it("reads a file with limit", async () => {
        const result = await executeTool<ReadFileResult>(readFile, { filePath: "src/math.ts", limit: 3 });

        expect(result.linesShown).toBe(3);
        expect(result.startLine).toBe(1);
        expect(result.endLine).toBe(3);
        expect(result.totalLines).toBe(8);
    });

    it("reads a file with both offset and limit", async () => {
        const result = await executeTool<ReadFileResult>(readFile, {
            filePath: "src/math.ts",
            offset: 1,
            limit: 2,
        });

        expect(result.startLine).toBe(2);
        expect(result.endLine).toBe(3);
        expect(result.linesShown).toBe(2);
    });

    it("reads files in subdirectories", async () => {
        const result = await executeTool<ReadFileResult>(readFile, { filePath: "src/utils/logger.ts" });

        expect(result.path).toBe("src/utils/logger.ts");
        expect(result.content).toContain("class Logger");
    });

    it("rejects paths outside the working directory", async () => {
        const result = await executeTool<ReadFileError>(readFile, { filePath: "../../etc/passwd" });

        expect(result.error).toBe("Cannot read files outside the working directory");
    });

    it("accepts absolute paths within the working directory", async () => {
        const result = await executeTool<ReadFileResult>(readFile, {
            filePath: `${fixture.workingDirectory}/src/math.ts`,
        });

        expect(result.path).toBe("src/math.ts");
        expect(result.content).toContain("export function add");
    });
});

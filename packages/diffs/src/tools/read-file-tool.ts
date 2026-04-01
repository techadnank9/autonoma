import { readFile } from "node:fs/promises";
import { relative, resolve } from "node:path";
import { tool } from "ai";
import { z } from "zod";

const readFileSchema = z.object({
    filePath: z.string().describe("The path to the file to read (absolute or relative to working directory)"),
    offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("Line number to start reading from (0-based). Omit to start from the beginning."),
    limit: z
        .number()
        .int()
        .min(1)
        .optional()
        .describe("Maximum number of lines to read. Omit to read the entire file."),
});

const MAX_LINES = 2000;

export function buildReadFileTool(workingDirectory: string) {
    return tool({
        description:
            "Read the contents of a file. " +
            "Returns file contents with line numbers. " +
            "For large files, use offset and limit to read specific sections.",
        inputSchema: readFileSchema,
        execute: async (input) => {
            const absolutePath = resolve(workingDirectory, input.filePath);
            const relativePath = relative(workingDirectory, absolutePath);

            // Prevent reading outside the working directory
            if (relativePath.startsWith("..")) {
                return { error: "Cannot read files outside the working directory" };
            }

            const content = await readFile(absolutePath, "utf-8");
            const allLines = content.split("\n");

            const offset = input.offset ?? 0;
            const limit = input.limit ?? MAX_LINES;
            const lines = allLines.slice(offset, offset + limit);

            const numberedLines = lines.map((line: string, i: number) => `${offset + i + 1}\t${line}`).join("\n");

            return {
                path: relativePath,
                content: numberedLines,
                totalLines: allLines.length,
                linesShown: lines.length,
                startLine: offset + 1,
                endLine: offset + lines.length,
            };
        },
    });
}

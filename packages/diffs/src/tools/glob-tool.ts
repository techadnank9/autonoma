import { tool } from "ai";
import { glob } from "glob";
import { z } from "zod";

const globSchema = z.object({
    pattern: z.string().describe("The glob pattern to match files against (e.g. '**/*.ts', 'src/**/*.tsx')"),
    cwd: z.string().optional().describe("The directory to search in. Defaults to the working directory."),
});

export function buildGlobTool(workingDirectory: string) {
    return tool({
        description:
            "Search for files matching a glob pattern. " +
            "Use this to find files by name or extension. " +
            "Returns a list of matching file paths relative to the working directory.",
        inputSchema: globSchema,
        execute: async (input) => {
            const matches = await glob(input.pattern, {
                cwd: input.cwd ?? workingDirectory,
                nodir: true,
                ignore: ["**/node_modules/**", "**/dist/**", "**/.git/**"],
            });

            return {
                matches,
                count: matches.length,
            };
        },
    });
}

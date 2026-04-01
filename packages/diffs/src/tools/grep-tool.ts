import { execFile, execFileSync } from "node:child_process";
import { promisify } from "node:util";
import { tool } from "ai";
import { z } from "zod";

const execFileAsync = promisify(execFile);

let isRipGrepOnSystem = false;

function assertRipgrepAvailable(): void {
    if (isRipGrepOnSystem) return;

    try {
        execFileSync("rg", ["--version"], { stdio: "ignore" });
        isRipGrepOnSystem = true;
    } catch {
        throw new Error(
            "ripgrep (rg) is not installed or not found in PATH. " +
                "Install it with: brew install ripgrep (macOS), apt install ripgrep (Ubuntu), or see https://github.com/BurntSushi/ripgrep#installation",
        );
    }
}

const grepSchema = z.object({
    pattern: z.string().describe("The regex pattern to search for in file contents"),
    glob: z.string().optional().describe("Glob pattern to filter files (e.g. '*.ts', '**/*.tsx')"),
    path: z.string().optional().describe("File or directory to search in. Defaults to the working directory."),
});

export function buildGrepTool(workingDirectory: string) {
    assertRipgrepAvailable();

    return tool({
        description:
            "Search for a regex pattern in file contents using ripgrep. " +
            "Returns matching lines with file paths and line numbers. " +
            "Use this to find code references, function definitions, imports, etc.",
        inputSchema: grepSchema,
        execute: async (input) => {
            const args = [
                "--no-heading",
                "--line-number",
                "--max-count=50",
                "--glob=!node_modules",
                "--glob=!dist",
                "--glob=!.git",
            ];

            if (input.glob != null) {
                args.push(`--glob=${input.glob}`);
            }

            args.push(input.pattern);
            args.push(input.path ?? workingDirectory);

            try {
                const { stdout } = await execFileAsync("rg", args, {
                    cwd: workingDirectory,
                    maxBuffer: 1024 * 1024,
                });

                const lines = stdout.trim().split("\n").filter(Boolean);
                return {
                    matches: lines,
                    count: lines.length,
                };
            } catch (error) {
                // rg exits with code 1 when no matches found - execFile surfaces this as an error
                const execError = error as { code?: number; stdout?: string };
                if (execError.code === 1) {
                    return { matches: [], count: 0 };
                }
                throw error;
            }
        },
    });
}

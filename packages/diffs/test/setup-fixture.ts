import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

export interface TestFixture {
    workingDirectory: string;
    cleanup: () => Promise<void>;
}

/**
 * Creates a temporary directory with a predefined file structure for testing tools.
 *
 * Structure:
 *   src/
 *     index.ts       - export { add } from "./math.js";
 *     math.ts        - export function add/subtract
 *     utils/
 *       logger.ts    - export class Logger
 *   README.md        - # Test Project
 */
export async function createTestFixture(): Promise<TestFixture> {
    const workingDirectory = await mkdtemp(join(tmpdir(), "diffs-test-"));

    await mkdir(join(workingDirectory, "src", "utils"), { recursive: true });

    await writeFile(
        join(workingDirectory, "src", "index.ts"),
        'export { add } from "./math.js";\nexport { Logger } from "./utils/logger.js";\n',
    );

    await writeFile(
        join(workingDirectory, "src", "math.ts"),
        [
            "export function add(a: number, b: number): number {",
            "  return a + b;",
            "}",
            "",
            "export function subtract(a: number, b: number): number {",
            "  return a - b;",
            "}",
            "",
        ].join("\n"),
    );

    await writeFile(
        join(workingDirectory, "src", "utils", "logger.ts"),
        [
            "export class Logger {",
            "  info(message: string): void {",
            '    console.log("[INFO]", message);',
            "  }",
            "",
            "  error(message: string): void {",
            '    console.error("[ERROR]", message);',
            "  }",
            "}",
            "",
        ].join("\n"),
    );

    await writeFile(join(workingDirectory, "README.md"), "# Test Project\n\nA simple test fixture.\n");

    return {
        workingDirectory,
        cleanup: () => rm(workingDirectory, { recursive: true, force: true }),
    };
}

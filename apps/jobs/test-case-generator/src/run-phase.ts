import { spawnSync } from "node:child_process";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import type { Logger } from "@autonoma/logger";
import { generateText, stepCountIs, tool } from "ai";
import z from "zod";

const BASH_TOOL_TIMEOUT_MS = 120_000;

const bedrock = createAmazonBedrock({
    region: process.env.AWS_REGION ?? "us-east-1",
    apiKey: process.env.BEDROCK_API_KEY,
});

export async function runPhase(promptContent: string, logger: Logger): Promise<void> {
    const result = await generateText({
        model: bedrock("us.anthropic.claude-sonnet-4-6"),
        tools: {
            bash: tool({
                description:
                    "Execute a bash command in the repository directory (/tmp/repo) and return its output. Use this to explore the codebase, read files, and write output files.",
                inputSchema: z.object({
                    command: z.string().describe("The bash command to execute"),
                }),
                execute: async (input: { command: string }) => {
                    const preview = input.command.slice(0, 120) + (input.command.length > 120 ? "…" : "");
                    logger.info("bash tool executing", { command: preview });
                    const execStart = Date.now();
                    const result = spawnSync("bash", ["-c", input.command], {
                        encoding: "utf-8",
                        timeout: BASH_TOOL_TIMEOUT_MS,
                        cwd: "/tmp/repo",
                    });
                    const stdout = result.stdout ?? "";
                    const stderr = result.stderr ?? "";
                    const output = (stdout + stderr).trimEnd() || "(no output)";
                    if (result.error != null) {
                        logger.error("bash tool spawn error", result.error, {
                            command: preview,
                            durationMs: Date.now() - execStart,
                        });
                    } else {
                        logger.info("bash tool done", {
                            durationMs: Date.now() - execStart,
                            outputChars: output.length,
                        });
                    }
                    return output;
                },
            }),
        },
        stopWhen: stepCountIs(250),
        onStepFinish: (step) => {
            const toolCalls = step.toolCalls.map((tc) => tc.toolName);
            logger.info("agent step finished", {
                finishReason: step.finishReason,
                toolCalls,
            });
        },
        system: `You are an expert code analyst running in a headless, fully automated environment. There is no user to interact with.
Your working directory is /tmp/repo which contains the full repository codebase.
Do NOT zip generated directories (autonoma/ or qa-tests/) — leave all files in place.
If you would normally ask the user a question, make a reasonable assumption and proceed automatically.`,
        prompt: promptContent,
    });

    logger.info("phase finished", {
        steps: result.steps.length,
        finishReason: result.finishReason,
        totalTokens: result.usage.totalTokens,
    });
}

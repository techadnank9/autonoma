import { tool } from "ai";
import z from "zod";

const executionFinishedSchema = z.object({
    success: z.boolean().describe("Whether the execution was successful"),
    reasoning: z.string().describe("The reason why the execution was finished"),
});
export type ExecutionFinishedOutput = z.infer<typeof executionFinishedSchema>;

export function buildExecutionFinishedTool(onFinish: (output: ExecutionFinishedOutput) => void) {
    return tool({
        description: "Use this tool to indicate that the execution has finished",
        inputSchema: executionFinishedSchema,
        execute: onFinish,
    });
}

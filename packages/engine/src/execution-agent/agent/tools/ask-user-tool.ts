import { tool } from "ai";
import z from "zod";

export interface AskUserHandler {
    askQuestions: (
        questions: Array<{
            id: string;
            question: string;
            options: Array<{ id: string; label: string }>;
        }>,
    ) => Promise<string[]>;
}

const askUserSchema = z.object({
    questions: z
        .array(
            z.object({
                id: z.string().describe("Unique identifier for this question"),
                question: z.string().describe("The question to ask"),
                options: z
                    .array(
                        z.object({
                            id: z.string().describe("Unique identifier for this option"),
                            label: z.string().describe("The text to display for this option"),
                        }),
                    )
                    .min(2)
                    .max(5)
                    .describe("Pre-filled answer options"),
            }),
        )
        .min(1)
        .max(5)
        .describe("The questions to ask the user"),
});

export function buildAskUserTool(handler: AskUserHandler) {
    return tool({
        description:
            "Ask the user one or more questions when you are stuck or need clarification. " +
            "Use this after 2-3 failed attempts, when you encounter ambiguous instructions, " +
            "unexpected states (login walls, captchas), or need credentials. " +
            "Do NOT use this for obvious next steps or after the user already answered a similar question. " +
            "You can batch related questions into a single call (1-5 questions per call).",
        inputSchema: askUserSchema,
        execute: async (input) => {
            const answers = await handler.askQuestions(input.questions);
            return { answers };
        },
    });
}

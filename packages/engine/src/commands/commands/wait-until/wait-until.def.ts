import z from "zod";

export interface WaitUntilCommandSpec {
    interaction: "wait-until";
    params: { condition: string; timeout: number };
    output: { outcome: string; conditionMet: boolean; reasoning: string };
}

export const waitUntilParamsSchema = z.object({
    condition: z.string().describe("A natural language description of the condition to wait for on the page."),
    timeout: z.number().describe("The maximum time to wait for the condition in milliseconds."),
});

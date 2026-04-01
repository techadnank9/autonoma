import z from "zod";

export interface AssertionResult {
    assertion: string;
    metCondition: boolean;
    reason: string;
}

export interface AssertCommandSpec {
    interaction: "assert";
    params: { instruction: string };
    output: { outcome: string; results: AssertionResult[] };
}

export const assertParamsSchema = z.object({
    instruction: z
        .string()
        .describe(
            "A natural language description of one or more conditions to check on the page. " +
                "Can contain multiple assertions separated by 'and' or similar conjunctions.",
        ),
});

import z from "zod";

export interface ReadCommandSpec {
    interaction: "read";
    params: { description: string; variableName: string };
    output: { outcome: string; value: string };
}

export const readParamsSchema = z.object({
    description: z.string().describe("A natural language description of the text to extract from the current screen."),
    variableName: z
        .string()
        .describe(
            "The variable name to store the extracted value under. Use this name with {{variableName}} syntax in later commands.",
        ),
}) satisfies z.ZodType<ReadCommandSpec["params"]>;

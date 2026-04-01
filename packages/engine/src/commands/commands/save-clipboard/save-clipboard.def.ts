import z from "zod";

export interface SaveClipboardCommandSpec {
    interaction: "save-clipboard";
    params: { variableName: string };
    output: { outcome: string; value: string };
}

export const saveClipboardParamsSchema = z.object({
    variableName: z
        .string()
        .describe(
            "The variable name to store the clipboard content under. Use this name with {{variableName}} syntax in later commands.",
        ),
}) satisfies z.ZodType<SaveClipboardCommandSpec["params"]>;

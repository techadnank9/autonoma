import type { Point } from "@autonoma/image";
import z from "zod";

export interface TypeCommandSpec {
    interaction: "type";
    params: { description: string; text: string; overwrite: boolean };
    output: { outcome: string; point: Point; text: string };
}

export const typeParamsSchema = z.object({
    description: z.string().describe("A natural language description of the input element to click on."),
    text: z.string().describe("The text to type into the element."),
    overwrite: z
        .boolean()
        .default(false)
        .describe("If true, select all existing text before typing so the new text replaces it."),
});

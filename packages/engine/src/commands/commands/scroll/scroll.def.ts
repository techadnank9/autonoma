import type { Point } from "@autonoma/image";
import z from "zod";

export interface ScrollCommandSpec {
    interaction: "scroll";
    params: {
        elementDescription?: string;
        direction: "up" | "down";
        condition: string;
        maxScrolls: number;
    };
    output: {
        outcome: string;
        conditionMet: boolean;
        scrollsPerformed: number;
        point: Point | null;
    };
}

export const scrollParamsSchema = z.object({
    elementDescription: z
        .string()
        .optional()
        .describe("A natural language description of the specific element to scroll on."),
    direction: z.enum(["up", "down"]).describe("The direction to scroll."),
    condition: z
        .string()
        .describe("A visual condition to check after each scroll. Scrolling stops when this condition is met."),
    maxScrolls: z.number().describe("Maximum number of scrolls to perform before giving up. Defaults to 10."),
}) satisfies z.ZodType<ScrollCommandSpec["params"]>;

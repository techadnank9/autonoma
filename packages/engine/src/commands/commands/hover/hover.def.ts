import type { Point } from "@autonoma/image";
import z from "zod";

export interface HoverCommandSpec {
    interaction: "hover";
    params: { description: string };
    output: { outcome: string; point: Point };
}

export const hoverParamsSchema = z.object({
    description: z.string().describe("A natural language description of the element to hover over."),
});

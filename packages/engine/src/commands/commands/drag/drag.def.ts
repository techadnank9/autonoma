import type { Point } from "@autonoma/image";
import z from "zod";

export interface DragCommandSpec {
    interaction: "drag";
    params: { startDescription: string; endDescription: string };
    output: { outcome: string; startPoint: Point; endPoint: Point };
}

export const dragParamsSchema = z.object({
    startDescription: z.string().describe("A natural language description of the element to drag from."),
    endDescription: z.string().describe("A natural language description of the element to drag to."),
});

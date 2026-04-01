import type { Point } from "@autonoma/image";
import z from "zod";

export interface ClickCommandSpec<TClickOptions extends object = Record<string, never>> {
    interaction: "click";
    params: { description: string; options: TClickOptions };
    output: { outcome: string; point: Point };
}

export const clickBaseParamsSchema = z.object({
    description: z.string().describe("A natural language description of the element to click."),
});

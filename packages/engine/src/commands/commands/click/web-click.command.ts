import z from "zod";
import type { WebClickOptions } from "../../../platform";
import { ClickCommand } from "./click.command";

export const webClickOptionsSchema: z.ZodSchema<WebClickOptions> = z.object({
    button: z.enum(["left", "right", "middle"]).default("left").describe("The mouse button to use for the click."),
    clickCount: z.number().int().min(1).default(1).describe("The number of times to click."),
});

export class WebClickCommand extends ClickCommand<WebClickOptions> {
    protected readonly clickOptionsSchema = webClickOptionsSchema;
}

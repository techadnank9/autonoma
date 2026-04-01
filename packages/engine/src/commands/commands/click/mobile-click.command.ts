import z from "zod";
import { ClickCommand } from "./click.command";

export class MobileClickCommand extends ClickCommand {
    protected readonly clickOptionsSchema = z.object({});
}

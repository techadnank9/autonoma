import type { HoverCommandContext, HoverCommandSpec } from "../../../../commands";
import { CommandTool } from "../command-tool";

export class HoverTool extends CommandTool<HoverCommandSpec, HoverCommandContext> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return "Hover over an element on the page.";
    }

    protected async extractParams(input: HoverCommandSpec["params"]) {
        return input;
    }
}

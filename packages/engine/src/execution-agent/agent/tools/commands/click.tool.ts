import type { ClickCommandContext, ClickCommandSpec } from "../../../../commands";
import { CommandTool } from "../command-tool";

export class ClickTool<TClickOptions extends object = Record<string, never>> extends CommandTool<
    ClickCommandSpec<TClickOptions>,
    ClickCommandContext<TClickOptions>
> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return "Click on an element on the page.";
    }

    protected async extractParams(input: ClickCommandSpec<TClickOptions>["params"]) {
        return input;
    }
}

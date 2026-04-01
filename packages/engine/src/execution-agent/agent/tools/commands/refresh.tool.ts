import type { RefreshCommandContext, RefreshCommandSpec } from "../../../../commands";
import { CommandTool } from "../command-tool";

export class RefreshTool extends CommandTool<RefreshCommandSpec, RefreshCommandContext> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return "Refresh the current page. Use this when you need to reload the page content or reset the page state.";
    }

    protected async extractParams() {
        return {};
    }
}

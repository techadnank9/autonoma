import type { DragCommandContext, DragCommandSpec } from "../../../../commands";
import { CommandTool } from "../command-tool";

export class DragTool extends CommandTool<DragCommandSpec, DragCommandContext> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return "Drag an element from one position to another on the page.";
    }

    protected async extractParams(input: DragCommandSpec["params"]) {
        return input;
    }
}

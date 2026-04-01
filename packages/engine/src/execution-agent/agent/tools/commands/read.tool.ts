import type { ReadCommandSpec } from "../../../../commands";
import type { BaseCommandContext } from "../../../../platform";
import { CommandTool } from "../command-tool";

export class ReadTool extends CommandTool<ReadCommandSpec, BaseCommandContext> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return "Extract a text value visible on screen and store it as a named variable for use in later steps. Use {{variableName}} syntax in any command parameter to reference stored values.";
    }

    protected async extractParams(input: ReadCommandSpec["params"]) {
        return input;
    }
}

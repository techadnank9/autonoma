import type { AssertCommandSpec } from "../../../../commands";
import type { BaseCommandContext } from "../../../../platform";
import { CommandTool } from "../command-tool";

export class AssertTool extends CommandTool<AssertCommandSpec, BaseCommandContext> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return (
            "Assert that one or more conditions are met on the page by visually checking the screenshot. " +
            "Automatically splits multiple assertions and evaluates each independently."
        );
    }

    protected async extractParams(input: AssertCommandSpec["params"]) {
        return { instruction: input.instruction };
    }
}

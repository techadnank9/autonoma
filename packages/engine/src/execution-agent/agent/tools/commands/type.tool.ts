import type { TypeCommandContext, TypeCommandSpec } from "../../../../commands";
import { CommandTool } from "../command-tool";

export class TypeTool extends CommandTool<TypeCommandSpec, TypeCommandContext> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return "Click on an input element and type text into it. If overwrite is enabled, the existing text in the input element will be selected before typing so it gets replaced.";
    }

    protected async extractParams(input: TypeCommandSpec["params"]) {
        return {
            description: input.description,
            text: input.text,
            overwrite: input.overwrite,
        };
    }
}

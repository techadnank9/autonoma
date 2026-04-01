import type { SaveClipboardCommandContext, SaveClipboardCommandSpec } from "../../../../commands";
import { CommandTool } from "../command-tool";

export class SaveClipboardTool extends CommandTool<SaveClipboardCommandSpec, SaveClipboardCommandContext> {
    protected inputSchema() {
        return this.command.paramsSchema;
    }

    description(): string {
        return "Read the current clipboard content and store it as a named variable. Use this after clicking a 'Copy' button or similar UI element that copies text to the clipboard.";
    }

    protected async extractParams(input: SaveClipboardCommandSpec["params"]) {
        return input;
    }
}

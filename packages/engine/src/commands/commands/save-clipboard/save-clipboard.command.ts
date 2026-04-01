import type { BaseCommandContext, ClipboardDriver } from "../../../platform";
import { Command } from "../../command";
import type { CommandParams } from "../../command-spec";
import { type SaveClipboardCommandSpec, saveClipboardParamsSchema } from "./save-clipboard.def";

export interface SaveClipboardCommandContext extends BaseCommandContext {
    clipboard: ClipboardDriver;
}

export class SaveClipboardCommand extends Command<SaveClipboardCommandSpec, SaveClipboardCommandContext> {
    public readonly interaction = "save-clipboard" as const;
    public readonly paramsSchema = saveClipboardParamsSchema;

    async execute(
        { variableName }: CommandParams<SaveClipboardCommandSpec>,
        { clipboard }: SaveClipboardCommandContext,
    ): Promise<SaveClipboardCommandSpec["output"]> {
        this.logger.info("Reading clipboard content", { variableName });

        const value = await clipboard.read();

        this.logger.info("Clipboard content saved", { variableName, value });

        return {
            outcome: `Saved clipboard content "${value}" as "{{${variableName}}}"`,
            value,
        };
    }
}

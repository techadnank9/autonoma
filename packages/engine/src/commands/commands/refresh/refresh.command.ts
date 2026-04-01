import type { BaseCommandContext, NavigationDriver } from "../../../platform";
import { Command } from "../../command";
import type { CommandParams } from "../../command-spec";
import { type RefreshCommandSpec, refreshParamsSchema } from "./refresh.def";

export interface RefreshCommandContext extends BaseCommandContext {
    navigation: NavigationDriver;
}

export class RefreshCommand extends Command<RefreshCommandSpec, RefreshCommandContext> {
    public readonly interaction = "refresh" as const;
    public readonly paramsSchema = refreshParamsSchema;

    async execute(
        _params: CommandParams<RefreshCommandSpec>,
        { navigation }: RefreshCommandContext,
    ): Promise<RefreshCommandSpec["output"]> {
        this.logger.info("Executing refresh command");

        await navigation.refresh();

        const url = await navigation.getCurrentUrl();
        this.logger.info("Page refreshed", { url });

        return {
            outcome: `Page refreshed successfully. Current URL: ${url}`,
            url,
        };
    }
}

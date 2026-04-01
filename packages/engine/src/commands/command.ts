import { type Logger, logger } from "@autonoma/logger";
import type z from "zod";
import type { BaseCommandContext } from "../platform";
import type { CommandOutput, CommandParams, CommandSpec } from "./command-spec";

export abstract class Command<TSpec extends CommandSpec, TContext extends BaseCommandContext> {
    protected readonly logger: Logger;

    public abstract readonly interaction: TSpec["interaction"];

    public abstract readonly paramsSchema: z.ZodSchema<CommandParams<TSpec>>;

    constructor() {
        this.logger = logger.child({ name: this.constructor.name });
    }

    abstract execute(params: CommandParams<TSpec>, context: TContext): Promise<CommandOutput<TSpec>>;
}

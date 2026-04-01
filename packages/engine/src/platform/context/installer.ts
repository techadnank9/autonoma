import { type Logger, logger } from "@autonoma/logger";
import type z from "zod";
import type { BaseCommandContext } from "./base-context";
import type { ImageStream } from "./image-stream";
import type { VideoRecorder } from "./video-recorder";

interface InstallerOutput<TContext extends BaseCommandContext> {
    context: TContext;
    imageStream: ImageStream;
    videoRecorder: VideoRecorder;
}

/** Prepares the context for the execution, based on the application data. */
export abstract class Installer<TApplicationData, TContext extends BaseCommandContext> {
    protected readonly logger: Logger;

    /** The schema of the application data parameters. */
    abstract readonly paramsSchema: z.Schema<TApplicationData>;

    constructor() {
        this.logger = logger.child({ name: this.constructor.name });
    }

    /** Build the context for the execution agent, based on the application data. */
    protected abstract buildContext(params: TApplicationData): Promise<InstallerOutput<TContext>>;

    /** Cleans up any resources used by the installer. */
    public abstract cleanup(): Promise<void>;

    async install(params: TApplicationData): Promise<InstallerOutput<TContext>> {
        this.logger.info("Building context for test case", { params });
        return this.buildContext(params);
    }
}

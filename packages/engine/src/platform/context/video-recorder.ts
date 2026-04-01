import { type Logger, logger } from "@autonoma/logger";

export type VideoRecorderState = "initial" | "started" | "stopped";

export class InvalidStateError extends Error {
    constructor(method: string, state: VideoRecorderState) {
        super(`Cannot call ${method} in state ${state}`);
    }
}

/** Video recorder interface. */
export abstract class VideoRecorder {
    protected readonly logger: Logger;

    protected state: VideoRecorderState = "initial";

    protected abstract startRecording(): Promise<void>;
    protected abstract stopRecording(): Promise<void>;
    protected abstract computeVideoPath(): Promise<string>;

    constructor() {
        this.logger = logger.child({ name: this.constructor.name });
    }

    public async withRecording<T>(callback: () => Promise<T>): Promise<T> {
        try {
            await this.start();
            const result = await callback();
            await this.stop();
            return result;
        } finally {
            if (this.state === "started") {
                this.logger.fatal("Unexpected exit, stopping video recording");

                try {
                    await this.stop();
                } catch (error) {
                    this.logger.fatal("Failed to stop video recording", error);
                }
            }
        }
    }

    /** Starts the video recording. */
    private async start(): Promise<void> {
        if (this.state !== "initial") throw new InvalidStateError("start", this.state);

        this.logger.info("Starting video recording");

        await this.startRecording();

        this.state = "started";

        this.logger.info("Video recording started successfully");
    }

    /** Stops the video recording. Must have called start() first. */
    private async stop(): Promise<void> {
        if (this.state !== "started") throw new InvalidStateError("stop", this.state);

        this.logger.info("Stopping video recording");

        await this.stopRecording();

        this.state = "stopped";

        this.logger.info("Video recording stopped successfully");
    }

    /** Gets the path to the video file. Must have called stop() first. */
    public async getVideoPath(): Promise<string> {
        if (this.state !== "stopped") throw new InvalidStateError("getVideoPath", this.state);

        this.logger.info("Computing video path");

        return this.computeVideoPath();
    }
}

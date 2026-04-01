import { type ChildProcess, spawn } from "node:child_process";
import * as os from "node:os";
import path from "node:path";
import { VideoRecorder } from "@autonoma/engine";
import type { Browser } from "webdriverio";

export class IosVideoRecorder extends VideoRecorder {
    private videoPath?: string;
    private simctlProcess?: ChildProcess;

    constructor(private readonly driver: Browser) {
        super();
    }

    protected async startRecording(): Promise<void> {
        const udid = this.getSimulatorUdid();
        const tmpDir = os.tmpdir();
        const videoPath = path.join(tmpDir, `video-${Date.now()}.mp4`);

        this.logger.info("Starting iOS simulator recording via simctl", { udid, videoPath });

        this.simctlProcess = spawn("xcrun", ["simctl", "io", udid, "recordVideo", "--codec=h264", videoPath], {
            stdio: "ignore",
        });

        this.videoPath = videoPath;

        await new Promise<void>((resolve, reject) => {
            this.simctlProcess?.on("error", (error) => {
                reject(new Error(`Failed to start simctl recordVideo: ${error.message}`));
            });

            // Give simctl a moment to start up and fail if it's going to
            setTimeout(() => resolve(), 500);
        });
    }

    protected async stopRecording(): Promise<void> {
        if (this.simctlProcess == null) {
            this.logger.warn("No simctl recording process to stop");
            return;
        }

        this.logger.info("Sending SIGINT to simctl recordVideo process");

        await new Promise<void>((resolve) => {
            this.simctlProcess?.on("close", () => resolve());
            this.simctlProcess?.kill("SIGINT");
        });

        this.logger.info("iOS simulator recording stopped", { videoPath: this.videoPath });
    }

    protected async computeVideoPath(): Promise<string> {
        if (this.videoPath == null) throw new NoVideoPathError();
        return this.videoPath;
    }

    private getSimulatorUdid(): string {
        const caps = this.driver.capabilities as Record<string, unknown>;
        const udid = caps["appium:udid"] ?? caps.udid;
        if (typeof udid !== "string" || udid.length === 0) {
            throw new Error("Cannot record iOS simulator: could not determine simulator UDID");
        }
        return udid;
    }
}

export class NoVideoPathError extends Error {
    constructor() {
        super("No video path found.");
    }
}

import os from "node:os";
import path from "node:path";
import { VideoRecorder } from "@autonoma/engine";
import type { Page } from "playwright";
import { runPlaywright } from "./drivers/playwright-error";

export class NoPageVideoError extends Error {
    constructor() {
        super(
            "The page does not have a video stream. Remember to set the video recording directory when creating the browser context.",
        );
    }
}

export class WebVideoRecorder extends VideoRecorder {
    constructor(private readonly page: Page) {
        super();
    }

    protected async startRecording(): Promise<void> {
        // In web, this is a no-op: video recording starts automatically when the page is created.
        // We just validate that the page has a video stream.
        if (this.page.video() == null) throw new NoPageVideoError();
    }

    protected async stopRecording(): Promise<void> {
        if (this.page.isClosed()) return;
        await runPlaywright(() => this.page.close());
    }

    protected async computeVideoPath(): Promise<string> {
        const video = this.page.video();
        if (video == null) throw new NoPageVideoError();

        // Try local path first; falls back to saveAs for remote browsers
        try {
            const localPath = await runPlaywright(() => video.path());
            if (localPath != null) return localPath;
        } catch {
            // Fall through to saveAs
        }

        const savePath = path.join(os.tmpdir(), `video-${Date.now()}.webm`);
        await runPlaywright(() => video.saveAs(savePath));
        return savePath;
    }
}

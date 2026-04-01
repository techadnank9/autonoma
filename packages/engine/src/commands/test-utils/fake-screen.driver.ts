import type { Screenshot } from "@autonoma/image";
import type { ScreenDriver } from "../../platform";

export class NoScreenshotError extends Error {
    constructor() {
        super("No screenshot available");
    }
}

/**
 * A screen driver used for testing purposes. Allows the setting of a screenshot at any point in time.
 */
export class FakeScreenDriver implements ScreenDriver {
    constructor(private currentScreenshot: Screenshot | null = null) {}

    setScreenshot(screenshot: Screenshot) {
        this.currentScreenshot = screenshot;
    }

    async screenshot() {
        if (this.currentScreenshot == null) throw new NoScreenshotError();

        return this.currentScreenshot;
    }

    async getResolution() {
        if (this.currentScreenshot == null) throw new NoScreenshotError();

        return this.currentScreenshot.getResolution();
    }
}

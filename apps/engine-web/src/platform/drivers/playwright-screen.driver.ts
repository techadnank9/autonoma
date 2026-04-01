import type { ScreenDriver } from "@autonoma/engine";
import { type ScreenResolution, Screenshot } from "@autonoma/image";
import { type Logger, logger } from "@autonoma/logger";
import type { ActivePageManager } from "../active-page-manager";
import { PlaywrightError, runPlaywright } from "./playwright-error";

export class PlaywrightScreenDriver implements ScreenDriver {
    private readonly logger: Logger;

    constructor(private readonly pageManager: ActivePageManager) {
        this.logger = logger.child({ name: this.constructor.name });
    }

    async getResolution(): Promise<ScreenResolution> {
        const viewportSize = this.pageManager.current.viewportSize();
        if (viewportSize == null) throw new PlaywrightError(new Error("Viewport size is null"));
        return { width: viewportSize.width, height: viewportSize.height };
    }

    async screenshot(): Promise<Screenshot> {
        this.logger.info("Taking Playwright screenshot...");
        const buffer = await runPlaywright(() => this.pageManager.current.screenshot({ type: "jpeg", quality: 90 }));
        this.logger.info("Playwright screenshot taken", { bufferSize: buffer.length });
        return Screenshot.fromBuffer(buffer);
    }
}

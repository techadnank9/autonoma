import type { WebClickOptions, WebMouseDriver } from "@autonoma/engine";
import type { ScrollArgs } from "@autonoma/engine";
import { type ScreenResolution, boundingBoxCenter } from "@autonoma/image";
import type { ActivePageManager } from "../active-page-manager";
import { runPlaywright } from "./playwright-error";

export class PlaywrightMouseDriver implements WebMouseDriver {
    constructor(
        private readonly pageManager: ActivePageManager,
        private readonly screenResolution: ScreenResolution,
    ) {}

    async click(x: number, y: number, options?: WebClickOptions): Promise<void> {
        await runPlaywright(() =>
            this.pageManager.current.mouse.click(x, y, {
                button: options?.button,
                clickCount: options?.clickCount,
            }),
        );
    }

    async hover(x: number, y: number): Promise<void> {
        await runPlaywright(() => this.pageManager.current.mouse.move(x, y));
    }

    async drag(startX: number, startY: number, endX: number, endY: number): Promise<void> {
        const page = this.pageManager.current;
        await runPlaywright(async () => {
            await page.mouse.move(startX, startY);
            await page.mouse.down();
            await page.mouse.move(endX, endY, { steps: 10 });
            await page.mouse.up();
        });
    }

    async scroll({ point, direction }: ScrollArgs): Promise<void> {
        const halfScreenHeight = this.screenResolution.height / 2;
        const amount = direction === "up" ? -halfScreenHeight : halfScreenHeight;

        const { x, y } = point ?? boundingBoxCenter({ x: 0, y: 0, ...this.screenResolution });
        const page = this.pageManager.current;

        await runPlaywright(async () => {
            await page.mouse.move(x, y);
            await page.mouse.wheel(0, amount);
        });
    }
}

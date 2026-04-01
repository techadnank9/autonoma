import type { ApplicationDriver } from "@autonoma/engine";

export class AppiumApplicationDriver implements ApplicationDriver {
    async waitUntilStable(timeout = 3000): Promise<void> {
        await new Promise((resolve) => setTimeout(resolve, timeout));
    }
}

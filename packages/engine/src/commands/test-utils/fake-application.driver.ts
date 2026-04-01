import type { ApplicationDriver } from "../../platform";

export class FakeApplicationDriver implements ApplicationDriver {
    async waitUntilStable(): Promise<void> {
        return;
    }
}

import { logger } from "@autonoma/logger";
import type { DeviceDriver } from "../types";

export async function updateDateOnDevice(driver: DeviceDriver): Promise<void> {
    // Set default date and time to GMT + 1
    const GMT_OFFSET_MS = 60 * 60 * 1000;
    const date = new Date(Date.now() + GMT_OFFSET_MS);
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateFmt = `${pad(date.getUTCMonth() + 1)}${pad(date.getUTCDate())}${pad(date.getUTCHours())}${pad(date.getUTCMinutes())}${date.getUTCFullYear()}.00`;

    try {
        await driver.executeScript("mobile: shell", [{ command: "settings put global auto_time 0" }]);
        await driver.executeScript("mobile: shell", [{ command: "settings put global auto_time_zone 0" }]);
        await driver.executeScript("mobile: shell", [{ command: `su 0 date ${dateFmt}` }]);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to update date: ${message}`);
        throw error;
    }
}

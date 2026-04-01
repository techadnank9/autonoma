import type { ScreenResolution, Screenshot } from "@autonoma/image";

/** Basic interface for screen interaction */
export interface ScreenDriver {
    /** Get the screen resolution */
    getResolution(): Promise<ScreenResolution>;

    /** Take a screenshot of the screen */
    screenshot(): Promise<Screenshot>;
}

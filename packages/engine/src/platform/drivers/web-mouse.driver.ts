import type { MouseDriver } from "./mouse.driver";

export interface WebClickOptions {
    /** The mouse button to use. Defaults to "left". */
    button?: "left" | "right" | "middle";
    /** The number of clicks. Defaults to 1. */
    clickCount?: number;
}

/** A mouse driver with web-specific click options. */
export type WebMouseDriver = MouseDriver<WebClickOptions>;

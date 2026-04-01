import type { ApplicationDriver, ScreenDriver } from "../drivers";

/** The base context for all platforms. */
export interface BaseCommandContext {
    /** The screen driver. */
    screen: ScreenDriver;

    /** The application driver. */
    application: ApplicationDriver;
}

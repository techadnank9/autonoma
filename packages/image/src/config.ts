import type { Architecture } from "./geometry";

export type ScreenResolution = {
    width: number;
    height: number;
};

export type ScreenshotConfig = {
    screenResolution?: ScreenResolution;
    architecture?: Architecture;
    debug?: boolean;
};

let globalConfig: ScreenshotConfig = {};

export function setScreenshotConfig(config: ScreenshotConfig): void {
    globalConfig = { ...globalConfig, ...config };
}

export function getScreenshotConfig(): ScreenshotConfig {
    return globalConfig;
}

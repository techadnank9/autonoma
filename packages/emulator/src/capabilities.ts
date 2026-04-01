import type { Emulator } from "./emulator";

function buildBaseCapabilities(emulator: Emulator): Record<string, unknown> {
    return {
        "appium:shouldTerminateApp": true,
        "appium:newCommandTimeout": 0,
        "appium:deviceName": emulator.name,
    };
}

export function buildIosCapabilities(
    emulator: Emulator,
    autoAcceptAlerts = true,
    fullReset = false,
): Record<string, unknown> {
    const base = buildBaseCapabilities(emulator);

    return {
        platformName: "iOS",
        "appium:platformVersion": "18.1",
        "appium:automationName": "XCUITest",
        "appium:isHeadless": true,
        "appium:autoAcceptAlerts": autoAcceptAlerts,
        "appium:wdaLocalPort": emulator.systemPort,
        "appium:mjpegServerPort": emulator.mjpegPort,
        "appium:mjpegServerFramerate": 5,
        "appium:wdaLaunchTimeout": 360_000,
        "appium:wdaConnectionTimeout": 360_000,
        "appium:showIOSLog": false,
        "appium:showSafariNetworkLog": false,
        "appium:showSafariConsoleLog": false,
        "appium:useXctestrunFile": false,
        "appium:fullReset": fullReset,
        ...base,
    };
}

export function buildAndroidCapabilities(emulator: Emulator, autoAcceptAlerts = true): Record<string, unknown> {
    const base = buildBaseCapabilities(emulator);

    const capabilities: Record<string, unknown> = {
        platformName: "Android",
        "appium:automationName": "UiAutomator2",
        "appium:enforceAppInstall": true,
        "appium:hideKeyboard": true,
        "appium:appWaitActivity": "*",
        "appium:autoGrantPermissions": autoAcceptAlerts,
        "appium:skipServerInstallation": true,
        ...base,
    };

    if (emulator.config.nodeEnv === "development") {
        capabilities["appium:mjpegServerPort"] = emulator.mjpegPort;
    }

    return capabilities;
}

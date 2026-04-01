export type EmulatorConfig = {
    nodeEnv: "production" | "development" | "test";
    architecture: "IOS" | "ANDROID";
};

export interface DeviceInfo {
    deviceId: string;
    machineId: string;
    health: { status: string };
    hostname: string;
    appiumPort: number;
    mjpegStreamPort: number;
    wdaPort: number;
    lastSeen: number;
    deviceType: "runner";
    architecture: "IOS" | "ANDROID";
}

/** Minimal driver interface — WebdriverIO.Browser satisfies structurally */
export interface DeviceDriver {
    execute(script: string, args?: unknown): Promise<unknown>;
    executeScript(script: string, args: unknown[]): Promise<unknown>;
    installApp(appPath: string): Promise<void>;
    removeApp(bundleId: string): Promise<boolean>;
    activateApp(bundleId: string): Promise<void>;
    queryAppState(bundleId: string): Promise<number>;
    getCurrentPackage(): Promise<string>;
}

export interface Contact {
    name: string;
    phone: string;
    email: string;
}

export interface EmulatorCreateOptions {
    config: EmulatorConfig;
    owner?: string;
    /** One or more daemon hosts to try for lock acquisition. Tried in random order. */
    daemonHosts?: string[];
}

export interface PrepareDeviceOptions {
    appPath?: string;
    contacts?: Contact[];
    proxyConfig?: ProxyConfig;
    appPackage?: string;
}

export interface ProxyConfig {
    organizationId: string;
    proxyOrgIds: string[];
    proxyHost: string;
    proxyPort: number;
}

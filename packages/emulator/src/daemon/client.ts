import { createWriteStream, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { Readable } from "node:stream";
import { finished } from "node:stream/promises";
import { logger } from "@autonoma/logger";

type LockResponse = {
    token: string;
    id: string;
    owner: string;
    pool: string;
    appiumPort: number;
    systemPort: number;
    mjpegPort: number;
};

export type DaemonLockInfo = {
    id: string;
    token: string;
    appiumPort: number;
    systemPort: number;
    mjpegPort: number;
};

const DAEMON_PORT = 3000;
const PING_INTERVAL_MS = 15_000;

export class DaemonClient {
    private token?: string;
    private deviceId?: string;
    private pingTimer?: ReturnType<typeof setInterval>;
    private readonly baseUrl: string;

    constructor(private readonly host: string) {
        this.baseUrl = `http://${host}:${DAEMON_PORT}`;
    }

    async acquireLock(owner: string): Promise<DaemonLockInfo> {
        const daemonPool = "runner";

        const res = await fetch(`${this.baseUrl}/lock`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ owner, pool: daemonPool }),
            signal: AbortSignal.timeout(30_000),
        });

        if (!res.ok) {
            const body = await res.text();
            throw new Error(`Failed to acquire lock from daemon (${res.status}): ${body}`);
        }

        const data = (await res.json()) as LockResponse;
        this.token = data.token;
        this.deviceId = data.id;

        logger.info(`[DaemonClient] Acquired lock: device=${data.id}, appiumPort=${data.appiumPort}`);

        this.startPingInterval();

        return {
            id: data.id,
            token: data.token,
            appiumPort: data.appiumPort,
            systemPort: data.systemPort,
            mjpegPort: data.mjpegPort,
        };
    }

    async releaseLock(): Promise<void> {
        this.stopPingInterval();

        if (this.deviceId == null || this.token == null) {
            logger.warn("[DaemonClient] releaseLock called but no lock held");
            return;
        }

        try {
            const res = await fetch(`${this.baseUrl}/lock/${this.deviceId}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: this.token }),
                signal: AbortSignal.timeout(10_000),
            });

            if (!res.ok) {
                const body = await res.text();
                logger.error(`[DaemonClient] Failed to release lock (${res.status}): ${body}`);
            } else {
                logger.info(`[DaemonClient] Released lock for device=${this.deviceId}`);
            }
        } catch (err) {
            logger.error(`[DaemonClient] Error releasing lock: ${err instanceof Error ? err.message : String(err)}`);
        } finally {
            this.token = undefined;
            this.deviceId = undefined;
        }
    }

    /**
     * Download simulator logs from the daemon to a temp file.
     * Returns the local file path on success, undefined if unavailable.
     */
    async fetchSimulatorLogs(): Promise<string | undefined> {
        if (this.deviceId == null) return undefined;

        try {
            const res = await fetch(`${this.baseUrl}/lock/${this.deviceId}/logs`, {
                signal: AbortSignal.timeout(30_000),
            });
            if (!res.ok || res.body == null) return undefined;

            const dir = join(tmpdir(), "simulator-logs");
            mkdirSync(dir, { recursive: true });
            const filePath = join(dir, `sim-logs-${this.deviceId}-${Date.now()}.log`);

            const writeStream = createWriteStream(filePath);
            // @ts-ignore
            await finished(Readable.fromWeb(res.body).pipe(writeStream));

            logger.info(`[DaemonClient] Downloaded simulator logs to ${filePath}`);
            return filePath;
        } catch (err) {
            logger.warn(
                `[DaemonClient] Failed to fetch simulator logs for device=${this.deviceId}: ${err instanceof Error ? err.message : String(err)}`,
            );
            return undefined;
        }
    }

    getHostname(): string {
        return this.host;
    }

    getDeviceID(): string {
        if (!this.deviceId) {
            logger.error("[DaemonClient] Getting device ID without lock");
            return "";
        }
        return this.deviceId;
    }

    private startPingInterval() {
        this.stopPingInterval();

        this.pingTimer = setInterval(async () => {
            if (this.deviceId == null || this.token == null) {
                this.stopPingInterval();
                return;
            }

            try {
                const res = await fetch(`${this.baseUrl}/lock/${this.deviceId}/ping`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token: this.token }),
                    signal: AbortSignal.timeout(5_000),
                });

                if (!res.ok) {
                    logger.warn(`[DaemonClient] Ping failed (${res.status}) for device=${this.deviceId}`);
                }
            } catch (err) {
                logger.warn(
                    `[DaemonClient] Ping error for device=${this.deviceId}: ${err instanceof Error ? err.message : String(err)}`,
                );
            }
        }, PING_INTERVAL_MS);

        // Allow the process to exit even if the ping timer is running
        if (this.pingTimer.unref) {
            this.pingTimer.unref();
        }
    }

    private stopPingInterval() {
        if (this.pingTimer != null) {
            clearInterval(this.pingTimer);
            this.pingTimer = undefined;
        }
    }
}

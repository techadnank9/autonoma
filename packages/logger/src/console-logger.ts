import { logger as sentryLogger } from "@sentry/node";
import { env } from "./env";

type LogLevel = "debug" | "info" | "warn" | "error" | "fatal";

const isProduction = env.NODE_ENV === "production";

const LEVEL_COLORS: Record<LogLevel, string> = {
    debug: "\x1b[36m", // cyan
    info: "\x1b[32m", // green
    warn: "\x1b[33m", // yellow
    error: "\x1b[31m", // red
    fatal: "\x1b[35m", // magenta
};

const RESET = "\x1b[0m";
const DIM = "\x1b[2m";
const BOLD = "\x1b[1m";

function formatTimestamp(): string {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    const ms = String(now.getMilliseconds()).padStart(3, "0");
    return `[${h}:${m}:${s}.${ms}]`;
}

function formatExtra(extra: Record<string, unknown>, colorize: boolean): string {
    const entries = Object.entries(extra).filter(([key]) => key !== "err");
    if (entries.length === 0) return "";

    const parts = entries.map(([key, value]) => {
        const formatted = typeof value === "string" ? value : JSON.stringify(value);
        return colorize ? `${DIM}${key}=${RESET}${formatted}` : `${key}=${formatted}`;
    });
    return ` ${parts.join(" ")}`;
}

export class ConsoleLogger {
    private readonly bindings: Record<string, unknown>;

    constructor(bindings: Record<string, unknown> = {}) {
        this.bindings = bindings;
    }

    child(bindings: Record<string, unknown>): ConsoleLogger {
        return new ConsoleLogger({ ...this.bindings, ...bindings });
    }

    debug(extra: Record<string, unknown>, message: string): void {
        this.log("debug", extra, message);
    }

    info(extra: Record<string, unknown>, message: string): void {
        this.log("info", extra, message);
    }

    warn(extra: Record<string, unknown>, message: string): void {
        this.log("warn", extra, message);
    }

    error(extra: Record<string, unknown>, message: string): void {
        this.log("error", extra, message);
    }

    fatal(extra: Record<string, unknown>, message: string): void {
        this.log("fatal", extra, message);
    }

    private log(level: LogLevel, extra: Record<string, unknown>, message: string): void {
        const allExtra = { ...this.bindings, ...extra };

        if (isProduction) {
            const { err: _err, ...params } = allExtra;
            this.sentryLog(level, message, params);
            this.plainPrint(level, allExtra, message);
            return;
        }

        this.prettyPrint(level, allExtra, message);
    }

    private sentryLog(level: LogLevel, message: string, params: Record<string, unknown>): void {
        switch (level) {
            case "fatal":
                sentryLogger.fatal(message, params);
                break;
            case "error":
                sentryLogger.error(message, params);
                break;
            case "warn":
                sentryLogger.warn(message, params);
                break;
            case "info":
                sentryLogger.info(message, params);
                break;
            case "debug":
                sentryLogger.debug(message, params);
                break;
        }
    }

    private plainPrint(level: LogLevel, allExtra: Record<string, unknown>, message: string): void {
        const timestamp = formatTimestamp();
        const levelTag = level.toUpperCase();
        const extraStr = formatExtra(allExtra, false);
        const line = `${timestamp} [${levelTag}] ${message}${extraStr}`;

        const output = level === "error" || level === "fatal" ? console.error : console.log;

        const err = allExtra.err;
        if (err instanceof Error && err.stack != null) {
            output(line);
            output(err.stack);
            return;
        }

        output(line);
    }

    private prettyPrint(level: LogLevel, allExtra: Record<string, unknown>, message: string): void {
        const color = LEVEL_COLORS[level];
        const timestamp = `${DIM}${formatTimestamp()}${RESET}`;
        const levelTag = `${color}${BOLD}${level.toUpperCase()}${RESET}`;
        const extraStr = formatExtra(allExtra, true);
        const line = `${timestamp} [${levelTag}] ${message}${extraStr}`;

        const output = level === "error" || level === "fatal" ? console.error : console.log;

        const err = allExtra.err;
        if (err instanceof Error && err.stack != null) {
            output(line);
            output(`${DIM}${err.stack}${RESET}`);
            return;
        }

        output(line);
    }
}

export const consoleLogger = new ConsoleLogger();

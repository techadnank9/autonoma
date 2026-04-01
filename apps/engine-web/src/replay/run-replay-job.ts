import { writeFileSync } from "node:fs";
import os from "node:os";
import { VisualConditionChecker } from "@autonoma/ai";
import { CostCollector } from "@autonoma/ai";
import { db } from "@autonoma/db";
import { WaitConditionChecker, createEngineModelRegistry } from "@autonoma/engine";
import { RunPersister } from "@autonoma/engine";
import { setScreenshotConfig } from "@autonoma/image";
import { logger as rootLogger, runWithSentry } from "@autonoma/logger";
import { S3Storage } from "@autonoma/storage";
import type { Browser } from "playwright";
import { chromium } from "playwright";
import { connectRemoteBrowser } from "../platform";
import { env } from "../platform/env";
import { WebInstaller } from "../platform/web-installer";
import { WebRunAPIRunner } from "./run-api-runner";
import type { ReplayWebCommandSpec } from "./web-command-spec";
import { createWebCommands } from "./web-commands";

const DEFAULT_VIEWPORT = { width: 1920, height: 1080 };
const VIDEO_EXTENSION = "webm";
const REMOTE_BROWSER_HEALTH_TIMEOUT_MS = 90_000;
const REMOTE_BROWSER_HEALTH_POLL_MS = 1_000;

async function waitForRemoteBrowserHealth(endpoint: string, logger: ReturnType<typeof rootLogger.child>) {
    const healthUrl =
        endpoint.startsWith("http://") || endpoint.startsWith("https://")
            ? `${endpoint.replace(/\/$/, "")}/json/version`
            : `http://${endpoint.replace(/\/$/, "")}/json/version`;
    const startedAt = Date.now();

    while (Date.now() - startedAt < REMOTE_BROWSER_HEALTH_TIMEOUT_MS) {
        try {
            const response = await fetch(healthUrl);
            if (response.ok) {
                logger.info("Remote browser healthcheck is ready", { healthUrl });
                return;
            }
        } catch {
            // Browser sidecar may still be starting up; keep polling.
        }

        await new Promise((resolve) => setTimeout(resolve, REMOTE_BROWSER_HEALTH_POLL_MS));
    }

    throw new Error(`Remote browser healthcheck timeout after ${REMOTE_BROWSER_HEALTH_TIMEOUT_MS}ms: ${healthUrl}`);
}

async function connectBrowser() {
    const logger = rootLogger.child({ name: "connect-browser" });

    if (env.REMOTE_BROWSER_URL != null) {
        logger.info("Connecting to remote browser", { endpoint: env.REMOTE_BROWSER_URL });

        await waitForRemoteBrowserHealth(env.REMOTE_BROWSER_URL, logger);

        const maxAttempts = 10;
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return await connectRemoteBrowser({
                    remoteChromeEndpoint: env.REMOTE_BROWSER_URL,
                    viewport: DEFAULT_VIEWPORT,
                });
            } catch (error) {
                if (attempt === maxAttempts) throw error;
                logger.warn(`Browser not ready, retrying (${attempt}/${maxAttempts})...`);
                await new Promise((r) => setTimeout(r, 2000));
            }
        }
    }

    logger.info("Launching local browser");
    return await chromium.launch({ headless: env.HEADLESS === "true" });
}

async function main(runId: string) {
    const logger = rootLogger.child({ name: "run-replay-job", runId });

    setScreenshotConfig({
        screenResolution: DEFAULT_VIEWPORT,
        architecture: "web",
    });

    const storageProvider = S3Storage.createFromEnv();
    const runPersister = new RunPersister<ReplayWebCommandSpec>({
        db,
        storageProvider,
        runId,
        videoExtension: VIDEO_EXTENSION,
    });

    let browser: Browser | undefined;
    let browserContext: Awaited<ReturnType<Browser["newContext"]>> | undefined;

    try {
        browser = await connectBrowser();
        browserContext = await browser.newContext({
            viewport: DEFAULT_VIEWPORT,
            recordVideo: { dir: os.tmpdir() },
        });

        const costCollector = new CostCollector();
        const models = createEngineModelRegistry(costCollector);
        const commands = createWebCommands(models);

        const runner = new WebRunAPIRunner({
            installer: new WebInstaller(browser, browserContext),
            commands,
            createWaitChecker: (screen) =>
                new WaitConditionChecker(
                    new VisualConditionChecker({
                        model: models.getModel({ model: "smart-visual", tag: "wait-condition-checker" }),
                    }),
                    screen,
                ),
            videoExtension: VIDEO_EXTENSION,
            runPersister,
            storageProvider,
        });

        await runner.runReplay();
        logger.info("Run replay job completed");
    } catch (error) {
        logger.error("Run replay job failed", error);

        try {
            await runPersister.markFailed();
        } catch (markFailedError) {
            logger.error("Failed to mark run as failed", markFailedError);
        }

        throw error;
    } finally {
        try {
            if (browserContext != null) {
                await browserContext.close();
            }
        } catch (error) {
            logger.error("Failed to close browser context", error);
        }

        try {
            if (browser != null) {
                await browser.close();
            }
        } catch (error) {
            logger.error("Failed to close browser", error);
        }

        try {
            writeFileSync("/tmp/flag/done", "");
        } catch (error) {
            logger.error("Failed to write flag file", error);
        }
    }
}

const args = process.argv.slice(2);
if (args.length !== 1) {
    console.error("Usage: tsx src/replay/run-replay-job.ts <runId>");
    process.exit(1);
}

// biome-ignore lint/style/noNonNullAssertion: Length === 1
const runId = args[0]!;

await runWithSentry({ name: "execution-agent-web", tags: { run_id: runId } }, () => main(runId));

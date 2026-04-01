import { spawn } from "node:child_process";
import { logger } from "@autonoma/logger";
import { Architecture } from "@autonoma/types";
import type { TriggerRunWorkflowParams } from "@autonoma/workflow";

const runLogger = logger.child({ name: "local-run" });

export async function triggerLocalRun(params: TriggerRunWorkflowParams): Promise<void> {
    const { runId, architecture } = params;

    if (architecture !== Architecture.web) {
        throw new Error(`Local run only supports web architecture, got: ${architecture}`);
    }

    runLogger.info("Spawning local run replay script", { runId });

    const child = spawn("pnpm", ["--filter", "@autonoma/engine-web", "run-replay", runId], {
        stdio: "inherit",
        detached: true,
    });

    child.unref();

    runLogger.info("Local run replay script spawned", { runId, pid: child.pid });
}

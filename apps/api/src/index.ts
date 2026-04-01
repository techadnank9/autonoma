import { logger } from "@autonoma/logger";
import { serve } from "@hono/node-server";
import * as Sentry from "@sentry/node";
import { createApiApp, shutdownApi } from "./app";
import { bootstrapApiRuntime } from "./bootstrap";
import { env } from "./env";

bootstrapApiRuntime();

const app = createApiApp();
const port = Number.parseInt(env.API_PORT);

logger.info(`Server running on port ${port}`);

const server = serve({ fetch: app.fetch, port });

async function shutdown() {
    server.close();
    await shutdownApi();
    await Sentry.flush();
    process.exit(0);
}

process.on("SIGTERM", () => {
    void shutdown();
});

process.on("SIGINT", () => {
    void shutdown();
});

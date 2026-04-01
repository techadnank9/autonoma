import { createSentryConfig, logger } from "@autonoma/logger";
import * as Sentry from "@sentry/node";
import { env } from "./env";

export function initializeSentry() {
    logger.info("Initializing Sentry");

    if (env.NODE_ENV === "production") {
        const sentryConfig = createSentryConfig(
            {
                tags: {
                    package: "job-run-completion-notification",
                    service: "job-run-completion-notification",
                },
                contextType: "job-run-completion-notification",
                contextName: "job-run-completion-notification",
            },
            env.SENTRY_DSN,
        );

        Sentry.init({ ...sentryConfig });

        logger.info("Sentry initialized in production mode");
    } else {
        console.log("Sentry disabled in non-production environment");
    }
}

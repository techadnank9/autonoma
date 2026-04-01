import { analytics } from "@autonoma/analytics";
import { createSentryConfig } from "@autonoma/logger";
import * as Sentry from "@sentry/node";
import { env } from "./env";

let bootstrapped = false;

function validateRuntimeConfig() {
    if (
        env.STRIPE_ENABLED &&
        env.STRIPE_WEBHOOK_DISPATCH_MODE === "workflow" &&
        env.STRIPE_INTERNAL_WEBHOOK_SECRET == null
    ) {
        throw new Error("STRIPE_INTERNAL_WEBHOOK_SECRET is required when STRIPE_WEBHOOK_DISPATCH_MODE=workflow");
    }
}

export function bootstrapApiRuntime() {
    if (bootstrapped) return;

    validateRuntimeConfig();

    Sentry.init(createSentryConfig({ contextType: "service", contextName: "api" }));

    if (env.POSTHOG_KEY != null) {
        analytics.init(env.POSTHOG_KEY, env.POSTHOG_HOST);
    }

    bootstrapped = true;
}

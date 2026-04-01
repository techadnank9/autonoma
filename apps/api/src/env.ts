import { env as dbEnv } from "@autonoma/db/env";
import { env as loggerEnv } from "@autonoma/logger/env";
import { env as storageEnv } from "@autonoma/storage/env";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    extends: [loggerEnv, dbEnv, storageEnv],
    server: {
        API_PORT: z.string(),
        APP_URL: z.string().optional().default("http://localhost:3000"),
        INTERNAL_DOMAIN: z.string().optional().default("autonoma.app"),
        ALLOWED_ORIGINS: z.string().optional().default("http://localhost:3000"),
        SCENARIO_ENCRYPTION_KEY: z.string().min(1),
        GOOGLE_CLIENT_ID: z.string().min(1),
        GOOGLE_CLIENT_SECRET: z.string().min(1),
        AGENT_VERSION: z.string().optional().default("latest"),
        POSTHOG_KEY: z.string().optional(),
        POSTHOG_HOST: z.string().optional().default("https://us.i.posthog.com"),
        GEMINI_API_KEY: z.string().min(1),
        REDIS_URL: z.string().min(1),
        LOCAL_GENERATION: z.stringbool().default(false),
        LOCAL_GENERATION_CONCURRENCY: z.coerce.number().int().positive().default(2),
        // Used to indicate that we're running in a test environment.
        // This is only intended to avoid importing certain modules, do not use it for any other purpose.
        TESTING: z.stringbool().default(false),
        STRIPE_ENABLED: z.stringbool().default(false),
        STRIPE_WEBHOOK_DISPATCH_MODE: z.enum(["direct", "workflow"]).optional().default("workflow"),
        STRIPE_INTERNAL_WEBHOOK_SECRET: z.string().min(1).optional(),
        STRIPE_INTERNAL_WEBHOOK_PROCESS_URL: z.url().optional(),
        STRIPE_SECRET_KEY: z.string().min(1).optional(),
        STRIPE_WEBHOOK_SECRET: z.string().min(1).optional(),
        STRIPE_SUBSCRIPTION_PRICE_ID: z.string().min(1).optional(),
        STRIPE_TOPUP_PRICE_ID: z.string().min(1).optional(),
        ENGINE_BILLING_SECRET: z.string().min(1).optional(),
        BILLING_GRACE_PERIOD_DAYS: z.coerce.number().int().min(0).default(3),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});

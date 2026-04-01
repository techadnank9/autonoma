import { type NodeOptions, googleGenAIIntegration, prismaIntegration, vercelAIIntegration } from "@sentry/node";
import { env } from "./env";

export interface SentryInitialScopeConfig {
    contextType: string;
    contextName?: string;
    tags?: Record<string, string>;
}

export function createSentryConfig(scopeConfig: SentryInitialScopeConfig, dsn?: string): NodeOptions {
    const { contextType, contextName, tags } = scopeConfig;
    const release = env.SENTRY_RELEASE;
    const prodDSN = dsn ?? env.SENTRY_DSN;
    const sentryEnvironment = env.SENTRY_ENV;
    const isProduction = env.NODE_ENV === "production";

    return {
        dsn: isProduction ? prodDSN : undefined,
        environment: sentryEnvironment,
        sendDefaultPii: true,
        release,
        enableLogs: true,

        tracesSampleRate: isProduction ? 1 : 0, // 100% in production, 0% in dev
        profilesSampleRate: isProduction ? 1 : 0,

        integrations: [
            prismaIntegration(),
            vercelAIIntegration({
                recordInputs: false,
                recordOutputs: false,
                force: true,
            }),
            googleGenAIIntegration({
                recordInputs: false,
                recordOutputs: false,
            }),
        ],

        initialScope: {
            tags: {
                ...tags,
            },
            contexts: {
                [contextType]: {
                    name: contextName,
                    type: contextType,
                },
            },
        },

        beforeSend(event, hint) {
            if (!isProduction) return null;

            // Skip network errors that are likely user connectivity issues
            if (event.exception?.values?.[0]?.type === "ChunkLoadError") {
                return null;
            }

            // Skip cancelled requests
            const error = hint.originalException as Error;
            if (error?.name === "AbortError") {
                return null;
            }

            return event;
        },
    } satisfies NodeOptions;
}

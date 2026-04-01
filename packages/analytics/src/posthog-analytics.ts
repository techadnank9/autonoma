import * as Sentry from "@sentry/node";
import { PostHog } from "posthog-node";

export class PostHogAnalytics {
    private client?: PostHog;

    init(apiKey: string, host?: string): void {
        this.client = new PostHog(apiKey, { host: host ?? "https://us.i.posthog.com" });
    }

    capture(distinctId: string, event: string, properties?: Record<string, unknown>): void {
        const span = Sentry.getActiveSpan();
        const traceId = span != null ? Sentry.spanToJSON(span).trace_id : undefined;

        const enriched = traceId != null ? { ...properties, $sentry_trace_id: traceId } : properties;

        this.client?.capture({ distinctId, event, properties: enriched });
    }

    async shutdown(): Promise<void> {
        await this.client?.shutdown();
    }
}

export const analytics = new PostHogAnalytics();

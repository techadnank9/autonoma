import type { CostFunction } from "./costs";
import type { MonitoringCallbacks } from "./monitoring";
import type { ModelUsage } from "./usage";

export interface CostRecord {
    model: string;
    tag: string;
    inputTokens: number;
    outputTokens: number;
    reasoningTokens: number;
    cacheReadTokens: number;
    costMicrodollars: number;
}

/**
 * Collects AI cost records in-memory during execution.
 *
 * Hooks into the {@link MonitoringCallbacks} to capture each LLM call's
 * token usage and cost. Records can be flushed after execution for persistence.
 */
export class CostCollector {
    private readonly records: CostRecord[] = [];

    public createMonitoringCallbacks(): MonitoringCallbacks {
        return {
            onRequest: () => {},
            onResponse: ({ modelId, tag, result, pricing }) => {
                this.records.push(this.buildRecord(modelId, tag, result.usage, pricing));
            },
            onError: () => {},
        };
    }

    public getRecords(): readonly CostRecord[] {
        return this.records;
    }

    private buildRecord(modelId: string, tag: string, usage: ModelUsage, pricing: CostFunction): CostRecord {
        const costDollars = pricing(usage);
        const costMicrodollars = Math.round(costDollars * 1_000_000);

        return {
            model: modelId,
            tag,
            inputTokens: usage.inputTokens,
            outputTokens: usage.outputTokens,
            reasoningTokens: usage.outputTokenDetails.reasoningTokens,
            cacheReadTokens: usage.inputTokenDetails.cacheReadTokens,
            costMicrodollars,
        };
    }
}

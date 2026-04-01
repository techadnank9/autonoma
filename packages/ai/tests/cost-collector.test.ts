import { describe, expect, it } from "vitest";
import { CostCollector } from "../src/registry/cost-collector";
import { inputCacheCostFunction, simpleCostFunction } from "../src/registry/costs";
import type { ResponseInformation } from "../src/registry/monitoring";
import { newModelUsage } from "../src/registry/usage";

function makeResponseInfo(
    overrides: Partial<Pick<ResponseInformation, "modelId" | "tag" | "pricing">> & {
        inputTokens?: number;
        outputTokens?: number;
        reasoningTokens?: number;
        cacheReadTokens?: number;
    },
): ResponseInformation {
    const usage = newModelUsage();
    usage.inputTokens = overrides.inputTokens ?? 100;
    usage.outputTokens = overrides.outputTokens ?? 50;
    usage.outputTokenDetails.reasoningTokens = overrides.reasoningTokens ?? 0;
    usage.inputTokenDetails.cacheReadTokens = overrides.cacheReadTokens ?? 0;
    usage.inputTokenDetails.noCacheTokens = usage.inputTokens - usage.inputTokenDetails.cacheReadTokens;

    return {
        name: "test-model",
        modelId: overrides.modelId ?? "gemini-3-flash",
        provider: "google",
        tag: overrides.tag ?? "agent-loop",
        context: {},
        pricing: overrides.pricing ?? simpleCostFunction({ inputCostPerM: 1, outputCostPerM: 2 }),
        result: { usage, text: "", finishReason: "stop", providerMetadata: undefined },
    } as unknown as ResponseInformation;
}

describe("CostCollector", () => {
    it("starts with no records", () => {
        const collector = new CostCollector();
        expect(collector.getRecords()).toHaveLength(0);
    });

    it("collects a record on each onResponse call", () => {
        const collector = new CostCollector();
        const callbacks = collector.createMonitoringCallbacks();

        callbacks.onResponse(makeResponseInfo({ tag: "agent-loop", modelId: "gemini-3-flash" }));
        callbacks.onResponse(makeResponseInfo({ tag: "point-detection", modelId: "gemini-3-flash" }));

        const records = collector.getRecords();
        expect(records).toHaveLength(2);
        expect(records[0]?.tag).toBe("agent-loop");
        expect(records[1]?.tag).toBe("point-detection");
    });

    it("captures token usage correctly", () => {
        const collector = new CostCollector();
        const callbacks = collector.createMonitoringCallbacks();

        callbacks.onResponse(
            makeResponseInfo({
                inputTokens: 1000,
                outputTokens: 500,
                reasoningTokens: 200,
                cacheReadTokens: 300,
            }),
        );

        const record = collector.getRecords()[0];
        expect(record).toBeDefined();
        expect(record?.inputTokens).toBe(1000);
        expect(record?.outputTokens).toBe(500);
        expect(record?.reasoningTokens).toBe(200);
        expect(record?.cacheReadTokens).toBe(300);
    });

    it("calculates cost in microdollars using simple pricing", () => {
        const collector = new CostCollector();
        const callbacks = collector.createMonitoringCallbacks();

        // $1/M input, $2/M output
        // 1M input tokens = $1, 500K output tokens = $1 → total $2 = 2_000_000 microdollars
        callbacks.onResponse(
            makeResponseInfo({
                inputTokens: 1_000_000,
                outputTokens: 500_000,
                pricing: simpleCostFunction({ inputCostPerM: 1, outputCostPerM: 2 }),
            }),
        );

        const record = collector.getRecords()[0];
        expect(record?.costMicrodollars).toBe(2_000_000);
    });

    it("calculates cost with cache pricing", () => {
        const collector = new CostCollector();
        const callbacks = collector.createMonitoringCallbacks();

        // $0.50/M input, $0.05/M cached input, $3/M output
        // 700K non-cached = $0.35, 300K cached = $0.015, 500K output = $1.50
        // Total = $1.865 = 1_865_000 microdollars
        callbacks.onResponse(
            makeResponseInfo({
                inputTokens: 1_000_000,
                outputTokens: 500_000,
                cacheReadTokens: 300_000,
                pricing: inputCacheCostFunction({
                    inputCostPerM: 0.5,
                    cachedInputCostPerM: 0.05,
                    outputCostPerM: 3,
                }),
            }),
        );

        const record = collector.getRecords()[0];
        expect(record?.costMicrodollars).toBe(1_865_000);
    });

    it("does not collect records on request or error", () => {
        const collector = new CostCollector();
        const callbacks = collector.createMonitoringCallbacks();

        callbacks.onRequest({} as never);
        callbacks.onError({} as never);

        expect(collector.getRecords()).toHaveLength(0);
    });

    it("preserves model id and tag from response info", () => {
        const collector = new CostCollector();
        const callbacks = collector.createMonitoringCallbacks();

        callbacks.onResponse(makeResponseInfo({ modelId: "ministral-8b", tag: "wait-planner" }));

        const record = collector.getRecords()[0];
        expect(record?.model).toBe("ministral-8b");
        expect(record?.tag).toBe("wait-planner");
    });

    it("accumulates records across multiple calls", () => {
        const collector = new CostCollector();
        const callbacks = collector.createMonitoringCallbacks();

        for (let i = 0; i < 5; i++) {
            callbacks.onResponse(makeResponseInfo({ tag: `tag-${i}` }));
        }

        expect(collector.getRecords()).toHaveLength(5);
    });
});

import type { ModelUsage } from "./usage";

export type CostFunction = (usage: ModelUsage) => number;

interface SimplePricing {
    inputCostPerM: number;
    outputCostPerM: number;
}

export function simpleCostFunction({ inputCostPerM, outputCostPerM }: SimplePricing): CostFunction {
    return ({ inputTokens, outputTokens }) => {
        if (inputTokens == null || outputTokens == null) throw new Error("Missing required token usage data");

        return inputCostPerM * (inputTokens / 1_000_000) + outputCostPerM * (outputTokens / 1_000_000);
    };
}

interface InputCachePricing extends SimplePricing {
    cachedInputCostPerM: number;
}

export function inputCacheCostFunction({
    inputCostPerM,
    cachedInputCostPerM,
    outputCostPerM,
}: InputCachePricing): CostFunction {
    return ({ inputTokens, inputTokenDetails, outputTokens }) => {
        if (inputTokens == null || inputTokenDetails == null) throw new Error("Missing required token usage data");

        return (
            inputCostPerM * (inputTokenDetails.noCacheTokens / 1_000_000) +
            cachedInputCostPerM * (inputTokenDetails.cacheReadTokens / 1_000_000) +
            outputCostPerM * (outputTokens / 1_000_000)
        );
    };
}

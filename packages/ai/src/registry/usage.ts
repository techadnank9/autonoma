import type { LanguageModel } from "./model-registry";

export interface ModelUsage {
    inputTokens: number;
    inputTokenDetails: {
        noCacheTokens: number;
        cacheReadTokens: number;
    };
    outputTokens: number;
    outputTokenDetails: { textTokens: number; reasoningTokens: number };
}

export function newModelUsage(): ModelUsage {
    return {
        inputTokens: 0,
        inputTokenDetails: { noCacheTokens: 0, cacheReadTokens: 0 },
        outputTokens: 0,
        outputTokenDetails: { textTokens: 0, reasoningTokens: 0 },
    };
}

type LanguageModelUsage = Awaited<ReturnType<LanguageModel["doGenerate"]>>["usage"];

export function updateModelUsage(oldUsage: ModelUsage, newUsage: LanguageModelUsage): ModelUsage {
    const {
        inputTokens: prevInputTokens,
        inputTokenDetails: prevInputTokenDetails,
        outputTokens: prevOutputTokens,
        outputTokenDetails: prevOutputTokenDetails,
    } = oldUsage;

    const { inputTokens: newInputTokens, outputTokens: newOutputTokens } = newUsage;

    return {
        inputTokens: prevInputTokens + (newInputTokens?.total ?? 0),
        inputTokenDetails: {
            noCacheTokens: prevInputTokenDetails.noCacheTokens + (newInputTokens?.noCache ?? 0),
            cacheReadTokens: prevInputTokenDetails.cacheReadTokens + (newInputTokens?.cacheRead ?? 0),
        },
        outputTokens: prevOutputTokens + (newOutputTokens?.total ?? 0),
        outputTokenDetails: {
            textTokens: prevOutputTokenDetails.textTokens + (newOutputTokens?.text ?? 0),
            reasoningTokens: prevOutputTokenDetails.reasoningTokens + (newOutputTokens?.reasoning ?? 0),
        },
    };
}

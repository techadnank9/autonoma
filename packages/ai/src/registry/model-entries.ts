import { type CostFunction, inputCacheCostFunction, simpleCostFunction } from "./costs";
import type { LanguageModel } from "./model-registry";
import { googleProvider, groqProvider, openRouterProvider } from "./providers";

export interface ModelEntry {
    createModel: () => LanguageModel;
    pricing: CostFunction;
}

export const MODEL_ENTRIES = {
    GEMINI_3_FLASH_PREVIEW: {
        createModel: () => googleProvider.getModel("gemini-3-flash-preview"),
        pricing: inputCacheCostFunction({
            inputCostPerM: 0.5,
            cachedInputCostPerM: 0.05,
            outputCostPerM: 3,
        }),
    },
    MINISTRAL_8B: {
        createModel: () => openRouterProvider.getModel("mistralai/ministral-8b-2512"),
        pricing: simpleCostFunction({
            inputCostPerM: 0.15,
            outputCostPerM: 0.15,
        }),
    },
    GPT_OSS_120B: {
        createModel: () => groqProvider.getModel("openai/gpt-oss-120b"),
        pricing: inputCacheCostFunction({
            inputCostPerM: 0.15,
            cachedInputCostPerM: 0.075,
            outputCostPerM: 0.6,
        }),
    },
} as const;

export const OPENROUTER_MODEL_ENTRIES = {
    GEMINI_3_FLASH_PREVIEW: {
        createModel: () => openRouterProvider.getModel("google/gemini-3-flash-preview"),
        pricing: inputCacheCostFunction({
            inputCostPerM: 0.5,
            cachedInputCostPerM: 0.05,
            outputCostPerM: 3,
        }),
    },
    MINISTRAL_8B: {
        createModel: () => openRouterProvider.getModel("meta-llama/llama-4-maverick"),
        pricing: simpleCostFunction({
            inputCostPerM: 0.2,
            outputCostPerM: 0.6,
        }),
    },
    GPT_OSS_120B: {
        createModel: () => openRouterProvider.getModel("openai/gpt-oss-120b"),
        pricing: inputCacheCostFunction({
            inputCostPerM: 0.15,
            cachedInputCostPerM: 0.075,
            outputCostPerM: 0.6,
        }),
    },
} as const;

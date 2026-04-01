import { type CostCollector, MODEL_ENTRIES, ModelRegistry } from "@autonoma/ai";

export type EngineModelRegistry = ModelRegistry<"fast-visual" | "smart-visual" | "fast-text">;

export function createEngineModelRegistry(costCollector?: CostCollector): EngineModelRegistry {
    return new ModelRegistry({
        models: {
            "fast-visual": MODEL_ENTRIES.MINISTRAL_8B,
            "smart-visual": MODEL_ENTRIES.GEMINI_3_FLASH_PREVIEW,
            "fast-text": MODEL_ENTRIES.GPT_OSS_120B,
        },
        monitoring: costCollector?.createMonitoringCallbacks(),
    });
}

import { MODEL_ENTRIES, ModelRegistry } from "@autonoma/ai";

export const testModelRegistry = new ModelRegistry({
    models: {
        "smart-visual": MODEL_ENTRIES.GEMINI_3_FLASH_PREVIEW,
        "fast-text": MODEL_ENTRIES.GPT_OSS_120B,
    },
});

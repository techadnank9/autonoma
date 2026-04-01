import type { GoogleGenerativeAIProviderOptions } from "@ai-sdk/google";
import type { GroqProviderOptions } from "@ai-sdk/groq";
import type { defaultSettingsMiddleware } from "ai";

export type ModelReasoningEffort = "none" | "low" | "medium" | "high";

export type ModelSettings = Parameters<typeof defaultSettingsMiddleware>[0]["settings"];

type ModelProviderOptions = {
    groq?: GroqProviderOptions;
    google?: GoogleGenerativeAIProviderOptions;
};

export interface ModelOptions<TModel extends string = string> {
    /**
     * The name of the model within the registry.
     */
    model: TModel;

    /**
     * A tag to identify the way this model will be used.
     *
     * For example, "assert" or "click-description-generator"
     */
    tag: string;

    /**
     * Cross-provider reasoning configuration.
     */
    reasoning?: ModelReasoningEffort;

    /**
     * Settings to use for generating text with this model.
     *
     * This includes, for example, the `temperature` or `maxTokens` settings.
     */
    settings?: ModelSettings;

    /**
     * Additional provider-specific options.
     */
    providerOptions?: ModelProviderOptions;
}

/**
 * Adds the correct reasoning effort to each provider's options.
 */
function addReasoningEffort(
    providerOptions: ModelProviderOptions | undefined,
    reasoning: ModelReasoningEffort,
): ModelProviderOptions {
    return {
        ...providerOptions,
        groq: {
            ...providerOptions?.groq,
            reasoningEffort: reasoning,
        },
        google: {
            ...providerOptions?.google,
            thinkingConfig: {
                ...providerOptions?.google?.thinkingConfig,
                thinkingLevel:
                    reasoning !== "none"
                        ? (reasoning ?? providerOptions?.google?.thinkingConfig?.thinkingLevel)
                        : undefined,
            },
        },
    };
}

/**
 * Build the generateText settings object, given a {@link ModelOptions} parameter.
 */
export function buildSettings({ reasoning, providerOptions, settings }: ModelOptions): ModelSettings {
    return {
        ...settings,
        providerOptions: reasoning != null ? addReasoningEffort(providerOptions, reasoning) : providerOptions,
    };
}

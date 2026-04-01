import {
    type LanguageModel as AISDKLanguageModel,
    type LanguageModelMiddleware,
    defaultSettingsMiddleware,
    wrapLanguageModel,
} from "ai";
import type { CostFunction } from "./costs";
import type { ModelEntry } from "./model-entries";
import { type MonitoringCallbacks, createLoggingMiddleware } from "./monitoring";
import { type ModelOptions, type ModelSettings, buildSettings } from "./options";
import { type ModelUsage, updateModelUsage } from "./usage";

export type LanguageModel = Extract<AISDKLanguageModel, { specificationVersion: "v3" }>;

interface ModelRegistryConfig<TModel extends string> {
    models: Record<TModel, ModelEntry>;
    defaultSettings?: Omit<ModelSettings, "providerOptions">;
    monitoring?: MonitoringCallbacks;
}

/**
 * The model registry holds all the {@link LanguageModel} instances, tracking their usage
 * and wrapping them with monitoring capabilities.
 */
export class ModelRegistry<TModel extends string> {
    private readonly models: Record<TModel, LanguageModel>;
    private readonly pricing: Record<string, CostFunction>;
    private readonly defaultSettings?: Omit<ModelSettings, "providerOptions">;
    private readonly monitoring?: MonitoringCallbacks;

    /**
     * Extra context that may be added to the model registry during any point in the execution.
     */
    private extraContext: Record<string, unknown>;

    private readonly usageTrackingMiddleware: LanguageModelMiddleware;
    public readonly modelUsage: Record<string, ModelUsage>;

    constructor({ models, defaultSettings, monitoring }: ModelRegistryConfig<TModel>) {
        const createdModels = Object.fromEntries(
            Object.entries(models).map(([key, entry]) => [key, (entry as ModelEntry).createModel()]),
        ) as Record<TModel, LanguageModel>;

        this.models = createdModels;

        this.pricing = Object.fromEntries(
            Object.entries(models).map(([key, entry]) => [
                createdModels[key as TModel].modelId,
                (entry as ModelEntry).pricing,
            ]),
        );

        this.defaultSettings = defaultSettings;
        this.monitoring = monitoring;
        this.extraContext = {};

        this.modelUsage = Object.fromEntries(
            Object.keys(models).map((key) => [
                createdModels[key as TModel].modelId,
                {
                    inputTokens: 0,
                    inputTokenDetails: { noCacheTokens: 0, cacheReadTokens: 0 },
                    outputTokens: 0,
                    outputTokenDetails: { textTokens: 0, reasoningTokens: 0 },
                } as const,
            ]),
        );

        this.usageTrackingMiddleware = {
            specificationVersion: "v3",
            wrapGenerate: async ({ doGenerate, model }) => {
                const result = await doGenerate();

                const modelId = model.modelId;
                const oldUsage = this.modelUsage[modelId];
                const newUsage = result.usage;

                if (oldUsage != null && newUsage != null)
                    this.modelUsage[modelId] = updateModelUsage(oldUsage, newUsage);

                return result;
            },
        };
    }

    public getModel(options: ModelOptions<TModel>): LanguageModel {
        const settings = buildSettings({ ...this.defaultSettings, ...options });
        const model = this.models[options.model];
        // biome-ignore lint/style/noNonNullAssertion: This is guaranteed by construction
        const pricing = this.pricing[model.modelId]!;

        return wrapLanguageModel({
            model,
            middleware: [
                ...(this.monitoring
                    ? [createLoggingMiddleware(options, () => this.extraContext, this.monitoring, pricing)]
                    : []),
                this.usageTrackingMiddleware,
                defaultSettingsMiddleware({ settings }),
            ],
        });
    }

    public resetContext(): void {
        this.extraContext = {};
    }

    public addContext(context: Record<string, unknown>): void {
        this.extraContext = { ...this.extraContext, ...context };
    }
}

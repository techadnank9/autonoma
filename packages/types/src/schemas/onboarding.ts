import { z } from "zod";

export const AgentLogEntrySchema = z.object({
    id: z.string(),
    message: z.string(),
    timestamp: z.string(),
});
export type AgentLogEntry = z.infer<typeof AgentLogEntrySchema>;

export const OnboardingStateSchema = z.object({
    id: z.string(),
    currentStep: z.number(),
    agentConnectedAt: z.string().nullable(),
    agentLogs: z.array(AgentLogEntrySchema),
    ngrokUrl: z.string().nullable(),
    ngrokTestsPassed: z.boolean(),
    productionUrl: z.string().nullable(),
    productionTestsPassed: z.boolean(),
    completedAt: z.string().nullable(),
});
export type OnboardingState = z.infer<typeof OnboardingStateSchema>;

export const SetNgrokUrlInputSchema = z.object({
    url: z.string().url(),
});

export const SetProductionUrlInputSchema = z.object({
    url: z.string().url(),
});

export const TestScenariosNgrokInputSchema = z.object({
    ngrokUrl: z.string().url(),
});

export const TestScenariosProductionInputSchema = z.object({
    productionUrl: z.string().url(),
});

export const ScenarioTestResultSchema = z.object({
    name: z.string(),
    passed: z.boolean(),
    error: z.string().optional(),
});
export type ScenarioTestResult = z.infer<typeof ScenarioTestResultSchema>;

export const TestScenariosResultSchema = z.object({
    results: z.array(ScenarioTestResultSchema),
    allPassed: z.boolean(),
});
export type TestScenariosResult = z.infer<typeof TestScenariosResultSchema>;

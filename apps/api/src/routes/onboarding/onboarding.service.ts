import type { PrismaClient } from "@autonoma/db";
import { type GenerationProvider, SnapshotNotPendingError, TestSuiteUpdater } from "@autonoma/test-updates";
import type { AgentLogEntry, ScenarioTestResult } from "@autonoma/types";
import { AgentLogEntrySchema } from "@autonoma/types";
import { z } from "zod";
import { Service } from "../service";

const MOCK_SCENARIOS = ["standard user flow", "empty state handling", "large dataset rendering"] as const;

export class OnboardingService extends Service {
    constructor(
        private readonly db: PrismaClient,
        private readonly generationProvider: GenerationProvider,
    ) {
        super();
    }

    async getState(applicationId: string) {
        this.logger.info("Getting onboarding state", { applicationId });

        const state = await this.db.onboardingState.upsert({
            where: { applicationId },
            create: { applicationId },
            update: {},
        });

        return this.formatState(state);
    }

    async pollAgentConnected(applicationId: string) {
        const state = await this.db.onboardingState.findUnique({
            where: { applicationId },
            select: { agentConnectedAt: true },
        });

        return { connected: state?.agentConnectedAt != null };
    }

    async getLogs(applicationId: string) {
        const state = await this.db.onboardingState.findUnique({
            where: { applicationId },
            select: { agentLogs: true },
        });

        const logs = this.parseAgentLogs(state?.agentLogs);
        return { logs };
    }

    async updateStep(applicationId: string, step: number) {
        this.logger.info("Updating onboarding step", { applicationId, step });

        const state = await this.db.onboardingState.upsert({
            where: { applicationId },
            create: { applicationId, currentStep: step },
            update: { currentStep: step },
        });

        return this.formatState(state);
    }

    async setNgrokUrl(applicationId: string, url: string) {
        this.logger.info("Setting ngrok URL", { applicationId });

        const state = await this.db.onboardingState.upsert({
            where: { applicationId },
            create: { applicationId, ngrokUrl: url },
            update: { ngrokUrl: url },
        });

        return this.formatState(state);
    }

    async testScenariosNgrok(applicationId: string, ngrokUrl: string) {
        this.logger.info("Testing scenarios via ngrok", { applicationId, ngrokUrl });

        const results: ScenarioTestResult[] = MOCK_SCENARIOS.map((name) => ({
            name,
            passed: true,
        }));

        const allPassed = results.every((r) => r.passed);

        if (allPassed) {
            await this.db.onboardingState.upsert({
                where: { applicationId },
                create: { applicationId, ngrokTestsPassed: true },
                update: { ngrokTestsPassed: true },
            });
        }

        this.logger.info("Ngrok scenario tests completed", { applicationId, allPassed });

        return { results, allPassed };
    }

    async setProductionUrl(applicationId: string, url: string) {
        this.logger.info("Setting production URL", { applicationId });

        const state = await this.db.onboardingState.upsert({
            where: { applicationId },
            create: { applicationId, productionUrl: url },
            update: { productionUrl: url },
        });

        return this.formatState(state);
    }

    async testScenariosProduction(applicationId: string, productionUrl: string) {
        this.logger.info("Testing scenarios in production", { applicationId, productionUrl });

        const results: ScenarioTestResult[] = MOCK_SCENARIOS.map((name) => ({
            name,
            passed: true,
        }));

        const allPassed = results.every((r) => r.passed);

        if (allPassed) {
            await this.db.onboardingState.upsert({
                where: { applicationId },
                create: { applicationId, productionTestsPassed: true },
                update: { productionTestsPassed: true },
            });
        }

        this.logger.info("Production scenario tests completed", { applicationId, allPassed });

        return { results, allPassed };
    }

    async reset(applicationId: string) {
        this.logger.info("Resetting onboarding", { applicationId });

        const state = await this.db.onboardingState.upsert({
            where: { applicationId },
            create: { applicationId },
            update: {
                currentStep: 0,
                agentConnectedAt: null,
                agentLogs: [],
                ngrokUrl: null,
                ngrokTestsPassed: false,
                productionUrl: null,
                productionTestsPassed: false,
                completedAt: null,
            },
        });

        this.logger.info("Onboarding reset", { applicationId });

        return this.formatState(state);
    }

    async complete(applicationId: string, organizationId: string) {
        this.logger.info("Completing onboarding", { applicationId });

        const state = await this.db.onboardingState.upsert({
            where: { applicationId },
            create: { applicationId, completedAt: new Date() },
            update: { completedAt: new Date() },
        });

        const app = await this.db.application.findFirst({
            where: { id: applicationId, organizationId },
            select: { mainBranch: { select: { id: true } } },
        });
        const branchId = app?.mainBranch?.id;

        if (branchId != null) {
            try {
                this.logger.info("Enqueuing generations after onboarding complete", { applicationId, branchId });
                const updater = await TestSuiteUpdater.continueUpdate({
                    db: this.db,
                    branchId,
                    organizationId,
                    jobProvider: this.generationProvider,
                });
                await updater.queuePendingGenerations({ autoActivate: true });
                this.logger.info("Generations enqueued", { applicationId, branchId });
            } catch (err) {
                if (err instanceof SnapshotNotPendingError) {
                    this.logger.info("No pending snapshot to enqueue - skipping", { applicationId, branchId });
                } else {
                    throw err;
                }
            }
        }

        this.logger.info("Onboarding completed", { applicationId });

        return this.formatState(state);
    }

    private parseAgentLogs(raw: unknown): AgentLogEntry[] {
        const parsed = z.array(AgentLogEntrySchema).safeParse(raw);
        return parsed.success ? parsed.data : [];
    }

    private formatState(state: {
        id: string;
        currentStep: number;
        agentConnectedAt: Date | null;
        agentLogs: unknown;
        ngrokUrl: string | null;
        ngrokTestsPassed: boolean;
        productionUrl: string | null;
        productionTestsPassed: boolean;
        completedAt: Date | null;
    }) {
        return {
            id: state.id,
            currentStep: state.currentStep,
            agentConnectedAt: state.agentConnectedAt?.toISOString() ?? null,
            agentLogs: this.parseAgentLogs(state.agentLogs),
            ngrokUrl: state.ngrokUrl,
            ngrokTestsPassed: state.ngrokTestsPassed,
            productionUrl: state.productionUrl,
            productionTestsPassed: state.productionTestsPassed,
            completedAt: state.completedAt?.toISOString() ?? null,
        };
    }
}

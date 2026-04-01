import { ApplicationArchitecture } from "@autonoma/db";
import { TOTAL_GENERATION_STEPS } from "@autonoma/types";
import { expect } from "vitest";
import { GenerationService } from "../../src/generation/generation.service";
import { apiTestSuite } from "../api-test";

apiTestSuite({
    name: "generation",
    seed: async ({ harness }) => {
        const app = await harness.services.applications.createApplication({
            name: "Gen Test App",
            organizationId: harness.organizationId,
            architecture: ApplicationArchitecture.WEB,
            url: "https://example.com",
            file: "s3://bucket/file.png",
        });

        const generationService = new GenerationService(harness.db);

        return { app, generationService };
    },
    cases: (test) => {
        test("createGeneration creates a generation tied to the app", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const result = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            expect(result.id).toBeDefined();

            const gen = await harness.db.applicationGeneration.findUnique({
                where: { id: result.id },
            });
            expect(gen).not.toBeNull();
            expect(gen?.applicationId).toBe(app.id);
            expect(gen?.status).toBe("running");
            expect(gen?.currentStep).toBe(0);
        });

        test("createGeneration sets OnboardingState.agentConnectedAt", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            const state = await harness.db.onboardingState.findUnique({
                where: { applicationId: app.id },
            });
            expect(state).not.toBeNull();
            expect(state?.agentConnectedAt).not.toBeNull();
        });

        test("createGeneration throws for non-existent app", async ({ harness, seedResult: { generationService } }) => {
            await expect(
                generationService.createGeneration(harness.userId, harness.organizationId, "non-existent"),
            ).rejects.toThrow("Application not found");
        });

        test("addEvent with step.started updates currentStep", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.addEvent(id, harness.organizationId, {
                type: "step.started",
                data: { step: 1, name: "Scenarios" },
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.currentStep).toBe(1);
        });

        test("addEvent with step.completed for last step marks generation as completed", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.addEvent(id, harness.organizationId, {
                type: "step.completed",
                data: { step: TOTAL_GENERATION_STEPS - 1, name: "Environment Factory" },
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("completed");
            expect(gen?.completedAt).not.toBeNull();
        });

        test("addEvent with step.completed for non-last step does not complete generation", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.addEvent(id, harness.organizationId, {
                type: "step.completed",
                data: { step: 0, name: "Knowledge Base" },
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("running");
        });

        test("addEvent with error type marks generation as failed", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.addEvent(id, harness.organizationId, {
                type: "error",
                data: { message: "Something went wrong" },
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("failed");
            expect(gen?.errorMessage).toBe("Something went wrong");
        });

        test("addEvent with file.read creates event without changing status", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.addEvent(id, harness.organizationId, {
                type: "file.read",
                data: { filePath: "/src/index.ts" },
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("running");

            const events = await harness.db.generationEvent.findMany({ where: { generationId: id } });
            expect(events).toHaveLength(1);
            expect(events[0]?.type).toBe("file.read");
        });

        test("addEvent with file.created creates event without changing status", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.addEvent(id, harness.organizationId, {
                type: "file.created",
                data: { filePath: "/src/new-file.ts" },
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("running");
        });

        test("addEvent with log creates event without changing status", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.addEvent(id, harness.organizationId, {
                type: "log",
                data: { message: "Processing files..." },
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("running");
        });

        test("addEvent throws for non-existent generation", async ({ harness, seedResult: { generationService } }) => {
            await expect(
                generationService.addEvent("non-existent", harness.organizationId, {
                    type: "log",
                    data: { message: "test" },
                }),
            ).rejects.toThrow("Generation not found");
        });

        test("updateGeneration with name sets the generation name", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.updateGeneration(id, harness.organizationId, {
                name: "My Project",
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.name).toBe("My Project");
        });

        test("updateGeneration with status completed sets completedAt", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.updateGeneration(id, harness.organizationId, {
                status: "completed",
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("completed");
            expect(gen?.completedAt).not.toBeNull();
        });

        test("updateGeneration with status failed sets errorMessage", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            await generationService.updateGeneration(id, harness.organizationId, {
                status: "failed",
                errorMessage: "Fatal error",
            });

            const gen = await harness.db.applicationGeneration.findUnique({ where: { id } });
            expect(gen?.status).toBe("failed");
            expect(gen?.errorMessage).toBe("Fatal error");
        });

        test("updateGeneration throws for non-existent generation", async ({
            harness,
            seedResult: { generationService },
        }) => {
            await expect(
                generationService.updateGeneration("non-existent", harness.organizationId, {
                    name: "test",
                }),
            ).rejects.toThrow("Generation not found");
        });

        test("generation from another org cannot be accessed", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            const { id } = await generationService.createGeneration(harness.userId, harness.organizationId, app.id);

            const otherOrg = await harness.db.organization.create({
                data: { name: "Other Org", slug: "other-org-gen" },
            });

            // addEvent with wrong org should fail
            await expect(
                generationService.addEvent(id, otherOrg.id, {
                    type: "log",
                    data: { message: "test" },
                }),
            ).rejects.toThrow("Generation not found");

            // updateGeneration with wrong org should fail
            await expect(generationService.updateGeneration(id, otherOrg.id, { name: "hacked" })).rejects.toThrow(
                "Generation not found",
            );
        });
    },
});

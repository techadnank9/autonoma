import { ApplicationArchitecture } from "@autonoma/db";
import { expect } from "vitest";
import { GenerationService } from "../../src/generation/generation.service";
import { apiTestSuite } from "../api-test";

apiTestSuite({
    name: "app-generations-router",
    seed: async ({ harness }) => {
        const app = await harness.services.applications.createApplication({
            name: "AppGen Router Test",
            organizationId: harness.organizationId,
            architecture: ApplicationArchitecture.WEB,
            url: "https://example.com",
            file: "s3://bucket/file.png",
        });

        const generationService = new GenerationService(harness.db);

        const { id: generationId } = await generationService.createGeneration(
            harness.userId,
            harness.organizationId,
            app.id,
        );

        // Add several events
        await generationService.addEvent(generationId, harness.organizationId, {
            type: "step.started",
            data: { step: 0, name: "Knowledge Base" },
        });
        await generationService.addEvent(generationId, harness.organizationId, {
            type: "file.read",
            data: { filePath: "/src/index.ts" },
        });
        await generationService.addEvent(generationId, harness.organizationId, {
            type: "step.completed",
            data: { step: 0, name: "Knowledge Base" },
        });

        await generationService.updateGeneration(generationId, harness.organizationId, {
            name: "My Project",
        });

        return { app, generationId, generationService };
    },
    cases: (test) => {
        test("getLatest returns the most recent generation with events", async ({
            harness,
            seedResult: { app, generationId },
        }) => {
            const result = await harness.request().appGenerations.getLatest({
                applicationId: app.id,
            });

            expect(result).not.toBeNull();
            expect(result?.id).toBe(generationId);
            expect(result?.name).toBe("My Project");
            expect(result?.events).toHaveLength(3);
            expect(result?.events[0]?.type).toBe("step.started");
            expect(result?.events[1]?.type).toBe("file.read");
            expect(result?.events[2]?.type).toBe("step.completed");
        });

        test("getLatest returns the newest generation when multiple exist", async ({
            harness,
            seedResult: { app, generationService },
        }) => {
            // Create a second generation
            const { id: secondId } = await generationService.createGeneration(
                harness.userId,
                harness.organizationId,
                app.id,
            );
            await generationService.updateGeneration(secondId, harness.organizationId, {
                name: "Second Run",
            });

            const result = await harness.request().appGenerations.getLatest({
                applicationId: app.id,
            });

            expect(result).not.toBeNull();
            expect(result?.id).toBe(secondId);
            expect(result?.name).toBe("Second Run");
        });

        test("getLatest with no generations returns null", async ({ harness }) => {
            const emptyApp = await harness.services.applications.createApplication({
                name: "Empty App",
                organizationId: harness.organizationId,
                architecture: ApplicationArchitecture.WEB,
                url: "https://empty.com",
                file: "s3://bucket/file.png",
            });

            const result = await harness.request().appGenerations.getLatest({
                applicationId: emptyApp.id,
            });

            expect(result).toBeNull();
        });

        test("getById returns the specific generation with events", async ({
            harness,
            seedResult: { generationId },
        }) => {
            const result = await harness.request().appGenerations.getById({
                generationId,
            });

            expect(result).not.toBeNull();
            expect(result?.id).toBe(generationId);
            expect(result?.events).toHaveLength(3);
        });

        test("getById with wrong org returns null (org isolation)", async ({
            harness,
            seedResult: { generationId },
        }) => {
            // Create a different org with its own user and session
            const otherOrg = await harness.db.organization.create({
                data: { name: "Other Org", slug: "other-org-appgen" },
            });
            const otherUser = await harness.db.user.create({
                data: { name: "Other User", email: "other-appgen@example.com", emailVerified: true },
            });
            const otherSession = await harness.db.session.create({
                data: {
                    token: "other-session-token-appgen",
                    expiresAt: new Date(Date.now() + 86400000),
                    userId: otherUser.id,
                    activeOrganizationId: otherOrg.id,
                },
            });

            const result = await harness.request(otherSession).appGenerations.getById({
                generationId,
            });

            expect(result).toBeNull();
        });
    },
});

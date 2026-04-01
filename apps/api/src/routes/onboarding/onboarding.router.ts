import {
    SetNgrokUrlInputSchema,
    SetProductionUrlInputSchema,
    TestScenariosNgrokInputSchema,
    TestScenariosProductionInputSchema,
} from "@autonoma/types";
import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";

const applicationIdInput = z.object({ applicationId: z.string() });

export const onboardingRouter = router({
    getState: protectedProcedure
        .input(applicationIdInput)
        .query(({ ctx, input }) => ctx.services.onboarding.getState(input.applicationId)),

    pollAgentConnected: protectedProcedure
        .input(applicationIdInput)
        .query(({ ctx, input }) => ctx.services.onboarding.pollAgentConnected(input.applicationId)),

    getLogs: protectedProcedure
        .input(applicationIdInput)
        .query(({ ctx, input }) => ctx.services.onboarding.getLogs(input.applicationId)),

    updateStep: protectedProcedure
        .input(z.object({ applicationId: z.string(), step: z.number().int().min(0).max(5) }))
        .mutation(({ ctx, input }) => ctx.services.onboarding.updateStep(input.applicationId, input.step)),

    setNgrokUrl: protectedProcedure
        .input(SetNgrokUrlInputSchema.extend({ applicationId: z.string() }))
        .mutation(({ ctx, input }) => ctx.services.onboarding.setNgrokUrl(input.applicationId, input.url)),

    testScenariosNgrok: protectedProcedure
        .input(TestScenariosNgrokInputSchema.extend({ applicationId: z.string() }))
        .mutation(({ ctx, input }) => ctx.services.onboarding.testScenariosNgrok(input.applicationId, input.ngrokUrl)),

    setProductionUrl: protectedProcedure
        .input(SetProductionUrlInputSchema.extend({ applicationId: z.string() }))
        .mutation(({ ctx, input }) => ctx.services.onboarding.setProductionUrl(input.applicationId, input.url)),

    testScenariosProduction: protectedProcedure
        .input(TestScenariosProductionInputSchema.extend({ applicationId: z.string() }))
        .mutation(({ ctx, input }) =>
            ctx.services.onboarding.testScenariosProduction(input.applicationId, input.productionUrl),
        ),

    complete: protectedProcedure
        .input(applicationIdInput)
        .mutation(({ ctx, input }) => ctx.services.onboarding.complete(input.applicationId, ctx.organizationId)),

    reset: protectedProcedure
        .input(applicationIdInput)
        .mutation(({ ctx, input }) => ctx.services.onboarding.reset(input.applicationId)),
});

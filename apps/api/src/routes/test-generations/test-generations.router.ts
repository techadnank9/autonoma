import { z } from "zod";
import { internalProcedure, protectedProcedure, router } from "../../trpc";

export const generationsRouter = router({
    list: protectedProcedure
        .input(z.object({ applicationId: z.string().optional() }).optional())
        .query(({ ctx: { services, organizationId }, input }) =>
            services.testGenerations.listGenerations(organizationId, input?.applicationId),
        ),

    detail: protectedProcedure
        .input(z.object({ generationId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.testGenerations.getGenerationDetail(input.generationId, organizationId),
        ),

    delete: protectedProcedure
        .input(z.object({ generationId: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.testGenerations.deleteGeneration(input.generationId, organizationId),
        ),

    rerun: internalProcedure
        .input(z.object({ generationId: z.string(), planContent: z.string().optional() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.testGenerations.rerunGeneration(input.generationId, organizationId, input.planContent),
        ),
});

import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";

export const issuesRouter = router({
    list: protectedProcedure
        .input(z.object({ applicationId: z.string().optional() }).optional())
        .query(({ ctx: { services, organizationId }, input }) =>
            services.issues.listIssues(organizationId, input?.applicationId),
        ),

    detail: protectedProcedure
        .input(z.object({ issueId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.issues.getIssueDetail(input.issueId, organizationId),
        ),

    requestReview: protectedProcedure
        .input(z.object({ generationId: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.issues.requestReview(input.generationId, organizationId),
        ),

    requestRunReview: protectedProcedure
        .input(z.object({ runId: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.issues.requestRunReview(input.runId, organizationId),
        ),
});

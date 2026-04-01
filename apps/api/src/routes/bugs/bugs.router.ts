import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";

export const bugsRouter = router({
    list: protectedProcedure
        .input(
            z
                .object({
                    applicationId: z.string().optional(),
                    status: z.enum(["open", "resolved", "regressed"]).optional(),
                })
                .optional(),
        )
        .query(({ ctx: { services, organizationId }, input }) =>
            services.bugs.listBugs(organizationId, input?.applicationId, input?.status),
        ),

    detail: protectedProcedure
        .input(z.object({ bugId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.bugs.getBugDetail(input.bugId, organizationId),
        ),

    pendingReview: protectedProcedure
        .input(z.object({ applicationId: z.string().optional() }).optional())
        .query(({ ctx: { services, organizationId }, input }) =>
            services.bugs.pendingReview(organizationId, input?.applicationId),
        ),

    confirmIssue: protectedProcedure
        .input(z.object({ issueId: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.bugs.confirmIssue(input.issueId, organizationId),
        ),

    dismissIssue: protectedProcedure
        .input(z.object({ issueId: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.bugs.dismissIssue(input.issueId, organizationId),
        ),
});

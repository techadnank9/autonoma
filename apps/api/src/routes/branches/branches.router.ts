import { z } from "zod";
import { protectedProcedure, router } from "../../trpc";

export const branchesRouter = router({
    list: protectedProcedure
        .input(z.object({ applicationId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.branches.listBranches(input.applicationId, organizationId),
        ),

    detail: protectedProcedure
        .input(z.object({ branchId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.branches.getBranch(input.branchId, organizationId),
        ),

    detailByName: protectedProcedure
        .input(z.object({ applicationId: z.string(), branchName: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.branches.getBranchByName(input.applicationId, input.branchName, organizationId),
        ),

    snapshotHistory: protectedProcedure
        .input(z.object({ branchId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.branches.listSnapshots(input.branchId, organizationId),
        ),

    create: protectedProcedure
        .input(
            z.object({
                applicationId: z.string(),
                name: z.string().min(1),
                githubRef: z.string().optional(),
            }),
        )
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.branches.createBranch(input.applicationId, input.name, organizationId, input.githubRef),
        ),

    delete: protectedProcedure
        .input(z.object({ branchId: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.branches.deleteBranch(input.branchId, organizationId),
        ),
});

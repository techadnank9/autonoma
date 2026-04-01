import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../../trpc";

const adminProcedure = publicProcedure.use(async ({ ctx, next }) => {
    if (ctx.user == null || ctx.session == null) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (ctx.user.role !== "admin") {
        throw new TRPCError({
            code: "FORBIDDEN",
            message: "Admin access required",
        });
    }
    return next({ ctx: { ...ctx, user: ctx.user, session: ctx.session } });
});

export const adminRouter = router({
    listOrganizations: adminProcedure.query(({ ctx: { services } }) => services.admin.listOrganizations()),
    listPendingOrgs: adminProcedure.query(({ ctx: { services } }) => services.admin.listPendingOrgs()),
    approveOrg: adminProcedure
        .input(z.object({ orgId: z.string() }))
        .mutation(({ ctx: { services }, input }) => services.admin.approveOrg(input.orgId)),
    rejectOrg: adminProcedure
        .input(z.object({ orgId: z.string() }))
        .mutation(({ ctx: { services }, input }) => services.admin.rejectOrg(input.orgId)),
    createOrg: adminProcedure
        .input(z.object({ name: z.string().min(1), slug: z.string().min(1), domain: z.string().min(1) }))
        .mutation(({ ctx: { services }, input }) => services.admin.createOrg(input.name, input.slug, input.domain)),
    switchToOrg: adminProcedure
        .input(z.object({ orgId: z.string() }))
        .mutation(({ ctx, input }) => ctx.services.admin.switchToOrg(ctx.user.id, ctx.session.token, input.orgId)),
});

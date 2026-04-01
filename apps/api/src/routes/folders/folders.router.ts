import { z } from "zod";
import { internalProcedure, protectedProcedure, router } from "../../trpc";

export const foldersRouter = router({
    list: protectedProcedure
        .input(z.object({ applicationId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.folders.list(input.applicationId, organizationId),
        ),

    detail: protectedProcedure
        .input(z.object({ folderId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.folders.getFolderDetail(input.folderId, organizationId),
        ),

    create: internalProcedure
        .input(
            z.object({
                name: z.string().min(1),
                applicationId: z.string(),
                parentId: z.string().optional(),
                description: z.string().optional(),
            }),
        )
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.folders.createFolder(input, organizationId),
        ),

    rename: internalProcedure
        .input(z.object({ folderId: z.string(), name: z.string().min(1) }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.folders.renameFolder(input.folderId, input.name, organizationId),
        ),

    move: internalProcedure
        .input(z.object({ folderId: z.string(), newParentId: z.string().nullable() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.folders.moveFolder(input.folderId, input.newParentId, organizationId),
        ),

    delete: internalProcedure
        .input(z.object({ folderId: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.folders.deleteFolder(input.folderId, organizationId),
        ),

    updateDescription: internalProcedure
        .input(z.object({ folderId: z.string(), description: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.folders.updateFolderDescription(input.folderId, input.description, organizationId),
        ),
});

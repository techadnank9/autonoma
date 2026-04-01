import { z } from "zod";
import { zfd } from "zod-form-data";
import { protectedProcedure, router } from "../../trpc";

const CreateBulkSkillsFormDataSchema = zfd.formData({
    applicationId: zfd.text(),
    file: zfd.repeatable(z.array(zfd.file()).min(1)),
});

export const skillsRouter = router({
    create: protectedProcedure
        .input(
            z.object({
                name: z.string().min(1),
                description: z.string().min(1),
                content: z.string().min(1),
                applicationId: z.string(),
            }),
        )
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.skills.createSkill({ ...input, organizationId }),
        ),

    list: protectedProcedure
        .input(z.object({ applicationId: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.skills.listSkills(input.applicationId, organizationId),
        ),

    getBySlug: protectedProcedure
        .input(z.object({ applicationId: z.string(), slug: z.string() }))
        .query(({ ctx: { services, organizationId }, input }) =>
            services.skills.getSkillBySlug(input.applicationId, input.slug, organizationId),
        ),

    createBulk: protectedProcedure
        .input(CreateBulkSkillsFormDataSchema)
        .mutation(async ({ ctx: { services, organizationId }, input }) => {
            const { applicationId, file: files } = input;

            return services.skills.createBulkSkills({
                files,
                applicationId,
                organizationId,
            });
        }),

    delete: protectedProcedure
        .input(z.object({ applicationId: z.string(), slug: z.string() }))
        .mutation(({ ctx: { services, organizationId }, input }) =>
            services.skills.deleteSkill(input.applicationId, input.slug, organizationId),
        ),
});

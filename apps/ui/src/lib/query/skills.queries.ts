import { type QueryClient, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ensureAPIQueryData, useAPIMutation } from "lib/query/api-queries";
import { trpc } from "lib/trpc";

export function useCreateSkill() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.skills.create.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.skills.list.queryKey() });
            },
        }),
        successToast: { title: "Skill created" },
        errorToast: { title: "Failed to create skill" },
    });
}

export function useCreateBulkSkills() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.skills.createBulk.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.skills.list.queryKey() });
            },
        }),
        successToast: { title: "Skills uploaded" },
        errorToast: { title: "Failed to upload skills" },
    });
}

export function useSkills(applicationId: string) {
    return useSuspenseQuery(trpc.skills.list.queryOptions({ applicationId }));
}

export async function ensureSkillsListData(queryClient: QueryClient, applicationId: string) {
    await ensureAPIQueryData(queryClient, trpc.skills.list.queryOptions({ applicationId }));
}

export function useSkillDetail(applicationId: string, slug: string) {
    return useSuspenseQuery(trpc.skills.getBySlug.queryOptions({ applicationId, slug }));
}

export function useDeleteSkill() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.skills.delete.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.skills.list.queryKey() });
            },
        }),
        successToast: { title: "Skill deleted" },
        errorToast: { title: "Failed to delete skill" },
    });
}

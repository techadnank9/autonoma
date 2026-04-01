import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useAPIMutation } from "lib/query/api-queries";
import { trpc } from "lib/trpc";

export function useApiKeys() {
    return useSuspenseQuery(trpc.apiKeys.list.queryOptions());
}

export function useCreateApiKey() {
    const queryClient = useQueryClient();
    return useAPIMutation(
        trpc.apiKeys.create.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.apiKeys.list.queryKey() });
            },
        }),
    );
}

export function useDeleteApiKey() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.apiKeys.delete.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.apiKeys.list.queryKey() });
            },
        }),
        successToast: { title: "API key deleted" },
    });
}

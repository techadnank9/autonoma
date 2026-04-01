import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import type { QueryClient } from "@tanstack/react-query";
import { ensureAPIQueryData, useAPIMutation } from "lib/query/api-queries";
import { trpc } from "lib/trpc";
import { useCurrentApplication } from "routes/_blacklight/_app-shell/-use-current-application";

export function useFolders() {
    const currentApp = useCurrentApplication();
    return useSuspenseQuery(trpc.folders.list.queryOptions({ applicationId: currentApp.id }));
}

export function useFolderDetail(folderId: string) {
    return useSuspenseQuery(trpc.folders.detail.queryOptions({ folderId }));
}

export async function ensureFolderDetailData(queryClient: QueryClient, folderId: string) {
    await ensureAPIQueryData(queryClient, trpc.folders.detail.queryOptions({ folderId }));
}

export function useCreateFolder() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.folders.create.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.folders.list.queryKey() });
            },
        }),
        successToast: { title: "Folder created" },
        errorToast: { title: "Failed to create folder" },
    });
}

export function useRenameFolder(folderId: string) {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.folders.rename.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.folders.detail.queryKey({ folderId }) });
                void queryClient.invalidateQueries({ queryKey: trpc.folders.list.queryKey() });
            },
        }),
        errorToast: { title: "Failed to rename folder" },
    });
}

export function useMoveFolder(folderId: string) {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.folders.move.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.folders.list.queryKey() });
                void queryClient.invalidateQueries({ queryKey: trpc.folders.detail.queryKey({ folderId }) });
            },
        }),
        errorToast: { title: "Failed to move folder" },
    });
}

export function useDeleteFolder(folderId: string) {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.folders.delete.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.folders.list.queryKey() });
                void queryClient.invalidateQueries({ queryKey: trpc.tests.list.queryKey() });
                void queryClient.invalidateQueries({ queryKey: trpc.folders.detail.queryKey({ folderId }) });
            },
        }),
        successToast: { title: "Folder deleted" },
        errorToast: { title: "Failed to delete folder" },
    });
}

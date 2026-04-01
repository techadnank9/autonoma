import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ensureAPIQueryData, useAPIMutation } from "lib/query/api-queries";
import { trpc } from "lib/trpc";
import { useCurrentApplication } from "routes/_blacklight/_app-shell/-use-current-application";

export function useBugs(status?: "open" | "resolved" | "regressed") {
    const currentApp = useCurrentApplication();
    return useSuspenseQuery(trpc.bugs.list.queryOptions({ applicationId: currentApp.id, status }));
}

export function useBugDetail(bugId: string) {
    return useSuspenseQuery(trpc.bugs.detail.queryOptions({ bugId }));
}

export function usePendingBugReview() {
    const currentApp = useCurrentApplication();
    return useSuspenseQuery(trpc.bugs.pendingReview.queryOptions({ applicationId: currentApp.id }));
}

export async function ensureBugsListData(queryClient: QueryClient, applicationId: string) {
    await ensureAPIQueryData(queryClient, trpc.bugs.list.queryOptions({ applicationId }));
}

export async function ensureBugDetailData(queryClient: QueryClient, bugId: string) {
    await ensureAPIQueryData(queryClient, trpc.bugs.detail.queryOptions({ bugId }));
}

export function useConfirmBug() {
    const queryClient = useQueryClient();
    const currentApp = useCurrentApplication();
    return useAPIMutation(
        trpc.bugs.confirmIssue.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({
                    queryKey: trpc.bugs.list.queryKey(),
                });
                void queryClient.invalidateQueries({
                    queryKey: trpc.bugs.pendingReview.queryKey({ applicationId: currentApp.id }),
                });
            },
        }),
    );
}

export function useDismissIssue() {
    const queryClient = useQueryClient();
    const currentApp = useCurrentApplication();
    return useAPIMutation(
        trpc.bugs.dismissIssue.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({
                    queryKey: trpc.bugs.pendingReview.queryKey({ applicationId: currentApp.id }),
                });
            },
        }),
    );
}

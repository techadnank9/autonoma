import type { QueryClient } from "@tanstack/react-query";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useAPIMutation } from "lib/query/api-queries";
import { ensureAPIQueryData } from "lib/query/api-queries";
import { trpc } from "lib/trpc";
import { useCurrentApplication } from "routes/_blacklight/_app-shell/-use-current-application";

export function useIssues() {
    const currentApp = useCurrentApplication();
    return useSuspenseQuery(trpc.issues.list.queryOptions({ applicationId: currentApp.id }));
}

export function useIssueDetail(issueId: string) {
    return useSuspenseQuery(trpc.issues.detail.queryOptions({ issueId }));
}

export async function ensureIssuesListData(queryClient: QueryClient, applicationId: string) {
    await ensureAPIQueryData(queryClient, trpc.issues.list.queryOptions({ applicationId }));
}

export async function ensureIssueDetailData(queryClient: QueryClient, issueId: string) {
    await ensureAPIQueryData(queryClient, trpc.issues.detail.queryOptions({ issueId }));
}

export function useRequestReview() {
    const queryClient = useQueryClient();
    const currentApp = useCurrentApplication();
    return useAPIMutation({
        ...trpc.issues.requestReview.mutationOptions({
            onSettled: (_1, _2, { generationId }) => {
                void queryClient.invalidateQueries({
                    queryKey: trpc.issues.list.queryKey({ applicationId: currentApp.id }),
                });
                void queryClient.invalidateQueries({
                    queryKey: trpc.generations.detail.queryKey({ generationId }),
                });
            },
        }),
        successToast: { title: "Review requested" },
        errorToast: { title: "Failed to request review" },
    });
}

export function useRequestRunReview() {
    const queryClient = useQueryClient();
    const currentApp = useCurrentApplication();
    return useAPIMutation({
        ...trpc.issues.requestRunReview.mutationOptions({
            onSettled: (_1, _2, { runId }) => {
                void queryClient.invalidateQueries({
                    queryKey: trpc.issues.list.queryKey({ applicationId: currentApp.id }),
                });
                void queryClient.invalidateQueries({
                    queryKey: trpc.runs.detail.queryKey({ runId }),
                });
            },
        }),
        successToast: { title: "Review requested" },
        errorToast: { title: "Failed to request review" },
    });
}

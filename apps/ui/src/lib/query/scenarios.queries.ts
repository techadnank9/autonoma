import type { QueryClient } from "@tanstack/react-query";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ensureAPIQueryData } from "lib/query/api-queries";
import { trpc } from "lib/trpc";

export async function ensureScenariosData(queryClient: QueryClient, applicationId: string) {
    await Promise.all([
        ensureAPIQueryData(queryClient, trpc.scenarios.list.queryOptions({ applicationId })),
        ensureAPIQueryData(queryClient, trpc.scenarios.listWebhookCalls.queryOptions({ applicationId })),
    ]);
}

export function useScenariosForApp(applicationId: string) {
    return useSuspenseQuery(trpc.scenarios.list.queryOptions({ applicationId }));
}

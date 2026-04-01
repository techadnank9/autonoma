import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "lib/trpc";

export function usePollApplicationSetup(applicationId: string) {
    return useSuspenseQuery(
        trpc.applicationSetups.getLatest.queryOptions({ applicationId }, { refetchInterval: 2000 }),
    );
}

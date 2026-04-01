import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "lib/trpc";

export function useGithubTestCases(applicationId: string) {
    return useSuspenseQuery(trpc.github.getTestCases.queryOptions({ applicationId }));
}

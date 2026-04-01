import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useAPIMutation } from "lib/query/api-queries";
import { trpc, trpcClient } from "lib/trpc";

export function useOnboardingState(applicationId: string) {
    return useSuspenseQuery(trpc.onboarding.getState.queryOptions({ applicationId }));
}

export function usePollAgentConnected(applicationId: string) {
    return useSuspenseQuery(
        trpc.onboarding.pollAgentConnected.queryOptions({ applicationId }, { refetchInterval: 3000 }),
    );
}

export function usePollAgentLogs(applicationId: string) {
    return useSuspenseQuery(trpc.onboarding.getLogs.queryOptions({ applicationId }, { refetchInterval: 2000 }));
}

export function useResetOnboarding() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.onboarding.reset.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.onboarding.getState.queryKey() });
                void queryClient.invalidateQueries({ queryKey: trpc.onboarding.pollAgentConnected.queryKey() });
                void queryClient.invalidateQueries({ queryKey: trpc.onboarding.getLogs.queryKey() });
            },
        }),
        errorToast: { title: "Failed to reset onboarding" },
    });
}

function getOnboardingAppId() {
    return localStorage.getItem("autonoma.onboarding.applicationId") ?? "";
}

export function useSetNgrokUrl() {
    return useMutation({
        mutationFn: (input: { url: string }) =>
            trpcClient.onboarding.setNgrokUrl.mutate({ ...input, applicationId: getOnboardingAppId() }),
    });
}

export function useTestScenariosNgrok() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: { ngrokUrl: string }) =>
            trpcClient.onboarding.testScenariosNgrok.mutate({ ...input, applicationId: getOnboardingAppId() }),
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: trpc.onboarding.getState.queryKey() });
        },
    });
}

export function useSetProductionUrl() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: { url: string }) =>
            trpcClient.onboarding.setProductionUrl.mutate({ ...input, applicationId: getOnboardingAppId() }),
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: trpc.onboarding.getState.queryKey() });
        },
    });
}

export function useTestScenariosProduction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (input: { productionUrl: string }) =>
            trpcClient.onboarding.testScenariosProduction.mutate({ ...input, applicationId: getOnboardingAppId() }),
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: trpc.onboarding.getState.queryKey() });
        },
    });
}

export function useCompleteOnboarding() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => trpcClient.onboarding.complete.mutate({ applicationId: getOnboardingAppId() }),
        onSettled: () => {
            void queryClient.invalidateQueries({ queryKey: trpc.onboarding.getState.queryKey() });
        },
    });
}

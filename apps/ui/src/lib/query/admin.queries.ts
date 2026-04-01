import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { useAPIMutation } from "lib/query/api-queries";
import { trpc } from "lib/trpc";

export function useAdminOrganizations() {
    return useSuspenseQuery(trpc.admin.listOrganizations.queryOptions());
}

export function useAdminPendingOrgs() {
    return useSuspenseQuery(trpc.admin.listPendingOrgs.queryOptions());
}

export function useSwitchToOrg() {
    return useAPIMutation({
        ...trpc.admin.switchToOrg.mutationOptions(),
        errorToast: { title: "Failed to switch organization" },
    });
}

export function useApproveOrg() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.admin.approveOrg.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.admin.listPendingOrgs.queryKey() });
                void queryClient.invalidateQueries({ queryKey: trpc.admin.listOrganizations.queryKey() });
            },
        }),
        successToast: { title: "Organization approved" },
        errorToast: { title: "Failed to approve organization" },
    });
}

export function useRejectOrg() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.admin.rejectOrg.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.admin.listPendingOrgs.queryKey() });
                void queryClient.invalidateQueries({ queryKey: trpc.admin.listOrganizations.queryKey() });
            },
        }),
        successToast: { title: "Organization rejected" },
        errorToast: { title: "Failed to reject organization" },
    });
}

export function useCreateOrg() {
    const queryClient = useQueryClient();
    return useAPIMutation({
        ...trpc.admin.createOrg.mutationOptions({
            onSettled: () => {
                void queryClient.invalidateQueries({ queryKey: trpc.admin.listOrganizations.queryKey() });
            },
        }),
        successToast: { title: "Organization created" },
        errorToast: { title: "Failed to create organization" },
    });
}

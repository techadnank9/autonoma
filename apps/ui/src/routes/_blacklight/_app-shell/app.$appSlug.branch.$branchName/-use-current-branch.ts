import { useParams } from "@tanstack/react-router";
import { useBranchDetail } from "lib/query/branches.queries";
import { useCurrentApplication } from "../-use-current-application";

export function useCurrentBranch() {
    const app = useCurrentApplication();
    const { branchName } = useParams({ from: "/_blacklight/_app-shell/app/$appSlug/branch/$branchName" });
    const { data: branch } = useBranchDetail(app.id, branchName);
    return branch;
}

export function useCurrentSnapshot() {
    const branch = useCurrentBranch();
    return branch.activeSnapshot;
}

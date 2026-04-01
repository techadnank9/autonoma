import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ensureBranchData } from "lib/query/branches.queries";

export const Route = createFileRoute("/_blacklight/_app-shell/app/$appSlug/branch/$branchName")({
  loader: ({ context, params: { appSlug, branchName } }) => {
    const app = context.applications.find((a) => a.slug === appSlug);
    if (app == null) return;
    return ensureBranchData(context.queryClient, app.id, branchName);
  },
  component: BranchLayout,
});

function BranchLayout() {
  return <Outlet />;
}

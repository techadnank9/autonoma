import { WarningCircleIcon } from "@phosphor-icons/react/WarningCircle";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_blacklight/_app-shell/app/$appSlug/")({
  loader: ({ context, params }) => {
    const app = context.applications.find((a) => a.slug === params.appSlug);
    if (app?.mainBranch == null) throw notFound();

    throw redirect({
      to: "/app/$appSlug/branch/$branchName",
      params: { appSlug: params.appSlug, branchName: app.mainBranch.name },
      replace: true,
    });
  },
  notFoundComponent: MainBranchNotFound,
});

function MainBranchNotFound() {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <WarningCircleIcon size={48} className="mb-4 text-text-tertiary" />
      <h1 className="text-xl font-medium text-text-primary">Main branch not found</h1>
      <p className="mt-2 font-mono text-sm text-text-secondary">The application does not have a main branch set up.</p>
    </div>
  );
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@autonoma/blacklight";
import { CaretDownIcon } from "@phosphor-icons/react/CaretDown";
import { GitBranchIcon } from "@phosphor-icons/react/GitBranch";
import { PlusIcon } from "@phosphor-icons/react/Plus";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate, useParams, useRouteContext } from "@tanstack/react-router";
import { trpc } from "lib/trpc";
import { Suspense } from "react";

// ─── BranchSelector ──────────────────────────────────────────────────────────

function BranchSelector({
  appSlug,
  applicationId,
  currentBranch,
}: {
  appSlug: string;
  applicationId: string;
  currentBranch: string;
}) {
  const { data: branches } = useSuspenseQuery(trpc.branches.list.queryOptions({ applicationId }));
  const navigate = useNavigate();

  if (branches.length <= 1) {
    return (
      <span className="flex items-center gap-1.5 font-mono text-2xs text-text-secondary">
        <GitBranchIcon size={12} />
        {currentBranch}
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded px-2 py-1 font-mono text-2xs text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary">
        <GitBranchIcon size={12} />
        {currentBranch}
        <CaretDownIcon size={10} className="text-text-tertiary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch.id}
            className={branch.name === currentBranch ? "text-primary-ink" : ""}
            onClick={() => {
              void navigate({ to: "/app/$appSlug/branch/$branchName", params: { appSlug, branchName: branch.name } });
            }}
          >
            <GitBranchIcon size={12} />
            {branch.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── AppSelector ─────────────────────────────────────────────────────────────

function AppSelector({ currentApp }: { currentApp: { slug: string; name: string } }) {
  const applications = useRouteContext({ from: "/_blacklight/_app-shell", select: (ctx) => ctx.applications });
  const navigate = useNavigate();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-base hover:text-text-primary">
        {currentApp.name}
        <CaretDownIcon size={10} className="text-text-tertiary" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuItem
          className="gap-1.5 border border-dashed border-border-mid text-primary"
          onClick={() => {
            void navigate({ to: "/onboarding/install" });
          }}
        >
          <PlusIcon size={14} weight="bold" />
          Add app
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {applications.map((app) => (
          <DropdownMenuItem
            key={app.id}
            className={app.slug === currentApp.slug ? "text-primary-ink" : ""}
            onClick={() => {
              void navigate({ to: "/app/$appSlug", params: { appSlug: app.slug } });
            }}
          >
            {app.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── AppBreadcrumb ────────────────────────────────────────────────────────────

function AppBreadcrumb() {
  const applications = useRouteContext({ from: "/_blacklight/_app-shell", select: (ctx) => ctx.applications });
  const params = useParams({ strict: false }) as { appSlug?: string; branchName?: string };

  if (params.appSlug == null || params.branchName == null) return null;

  const app = applications.find((a) => a.slug === params.appSlug);
  if (app == null) return null;

  return (
    <div className="flex items-center gap-2">
      <AppSelector currentApp={app} />
      <span className="text-text-tertiary">/</span>
      <Suspense
        fallback={
          <span className="flex items-center gap-1.5 font-mono text-2xs text-text-tertiary">
            <GitBranchIcon size={12} />
            {params.branchName}
          </span>
        }
      >
        <BranchSelector appSlug={params.appSlug} applicationId={app.id} currentBranch={params.branchName} />
      </Suspense>
    </div>
  );
}

export { AppBreadcrumb };

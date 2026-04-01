import type { QueryClient } from "@tanstack/react-query";
import { Outlet, createRootRouteWithContext } from "@tanstack/react-router";
import posthog from "posthog-js";
import { useEffect } from "react";
import { useAuth } from "../lib/auth";
import type { authClient } from "../lib/auth";
import type { TRPCOptionsProxy } from "../lib/trpc";

export interface RouteContext {
  auth: typeof authClient;
  queryClient: QueryClient;
  trpc: TRPCOptionsProxy;
}

export const Route = createRootRouteWithContext<RouteContext>()({
  component: RootLayout,
});

function usePosthogIdentify() {
  const { user, isAuthenticated, activeOrganizationId } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
        organizationId: activeOrganizationId,
      });
    }
  }, [isAuthenticated, user, activeOrganizationId]);
}

function RootLayout() {
  const { session } = useAuth();

  usePosthogIdentify();

  if (session.isPending) {
    return (
      <div className="blacklight-dark flex min-h-screen items-center justify-center bg-surface-void">
        <span className="text-text-tertiary">Loading…</span>
      </div>
    );
  }

  return <Outlet />;
}

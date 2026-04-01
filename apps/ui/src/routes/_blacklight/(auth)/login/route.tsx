import { Outlet, createFileRoute } from "@tanstack/react-router";
import { ensureSessionData } from "lib/query/auth.queries";

export const Route = createFileRoute("/_blacklight/(auth)/login")({
  component: LoginLayout,
  beforeLoad: async ({ context: { queryClient } }) => {
    const session = await ensureSessionData(queryClient);
    if (session != null) throw Route.redirect({ to: "/" });
  },
});

function LoginLayout() {
  return <Outlet />;
}

import { useParams, useRouteContext } from "@tanstack/react-router";

export function useCurrentApplication() {
    const applications = useRouteContext({ from: "/_blacklight/_app-shell", select: (ctx) => ctx.applications });
    const { appSlug } = useParams({ from: "/_blacklight/_app-shell/app/$appSlug" });
    const app = applications.find((a) => a.slug === appSlug);
    if (app == null) throw new Error(`Application not found: ${appSlug}`);
    return app;
}

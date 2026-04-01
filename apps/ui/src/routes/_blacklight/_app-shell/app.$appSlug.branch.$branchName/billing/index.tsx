import { createFileRoute } from "@tanstack/react-router";
import { BillingPanel } from "../settings/-components/billing-panel";
import { SettingsTabNav } from "../settings/-settings-tab-nav";

export const Route = createFileRoute("/_blacklight/_app-shell/app/$appSlug/branch/$branchName/billing/")({
  component: BillingPage,
});

function BillingPage() {
  const { appSlug, branchName } = Route.useParams();

  return (
    <div className="flex flex-col gap-6">
      <SettingsTabNav activeTab="billing" appSlug={appSlug} branchName={branchName} />
      <BillingPanel />
    </div>
  );
}

import { Button } from "@autonoma/blacklight";
import { ArrowRightIcon } from "@phosphor-icons/react/ArrowRight";
import { CheckCircleIcon } from "@phosphor-icons/react/CheckCircle";
import { XCircleIcon } from "@phosphor-icons/react/XCircle";
import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "lib/auth";
import { markOnboardingCompleted } from "lib/onboarding/onboarding";
import { useCompleteOnboarding, useSetProductionUrl, useTestScenariosProduction } from "lib/onboarding/onboarding-api";
import { sounds } from "lib/onboarding/sounds";
import { toastManager } from "lib/toast-manager";
import type { RouterOutputs } from "lib/trpc";
import { useState } from "react";

type ScenarioTestResult = RouterOutputs["onboarding"]["testScenariosProduction"]["results"][number];

export const Route = createFileRoute("/_blacklight/onboarding/production")({
  component: ProductionPage,
});

function ProductionPage() {
  const { user } = useAuth();
  const [productionUrl, setProductionUrl] = useState("");
  const [testResults, setTestResults] = useState<ScenarioTestResult[]>([]);
  const [hasTested, setHasTested] = useState(false);

  const setProductionUrlMutation = useSetProductionUrl();
  const testScenariosProduction = useTestScenariosProduction();
  const completeOnboarding = useCompleteOnboarding();

  const allPassed = hasTested && testResults.length === 3 && testResults.every((r) => r.passed);
  const anyFailed = hasTested && testResults.some((r) => !r.passed);
  const isTesting = testScenariosProduction.isPending || setProductionUrlMutation.isPending;

  function handleRunTests() {
    if (productionUrl.length === 0) return;
    setProductionUrlMutation.mutate(
      { url: productionUrl },
      {
        onSuccess: () => {
          testScenariosProduction.mutate(
            { productionUrl },
            {
              onSuccess: (data) => {
                setTestResults(data.results);
                setHasTested(true);
                const allPassed = data.results.every((r) => r.passed);
                if (allPassed) {
                  sounds.complete();
                  toastManager.add({ title: "All production scenarios passed", type: "success" });
                } else {
                  sounds.error();
                  toastManager.add({ title: "Some scenarios failed in production", type: "warning" });
                }
              },
            },
          );
        },
      },
    );
  }

  function handleComplete() {
    completeOnboarding.mutate(undefined, {
      onSuccess: () => {
        if (user != null) {
          markOnboardingCompleted(user.id);
        }
        window.location.href = "/onboarding/complete";
      },
    });
  }

  return (
    <div className="py-16">
      <header className="mb-10 border-b border-border-dim pb-8">
        <h1 className="text-4xl font-medium tracking-tight text-text-primary">Verify in Production</h1>
        <p className="mt-3 font-mono text-sm text-text-secondary">
          All scenarios must pass on your production URL to complete onboarding.
        </p>
      </header>

      <div className="space-y-10">
        {/* 3 Production URL inputs */}
        <section className="space-y-4">
          <h2 className="font-mono text-2xs uppercase tracking-widest text-text-tertiary">Production URL</h2>
          <p className="text-sm text-text-secondary">Provide the production URL for your application.</p>

          <div className="flex flex-col gap-1.5 pt-2">
            <label htmlFor="production-url" className="font-mono text-2xs uppercase tracking-widest text-text-tertiary">
              Production URL
            </label>
            <div className="flex items-center gap-3">
              <input
                type="url"
                id="production-url"
                value={productionUrl}
                onChange={(e) => setProductionUrl(e.target.value)}
                placeholder="https://your-app.com"
                className="w-full max-w-lg border border-border-dim bg-surface-base px-4 py-2.5 font-mono text-sm text-text-primary placeholder-text-tertiary/50 outline-none focus:border-primary-ink/50"
              />
              {hasTested &&
                (allPassed ? (
                  <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-lime-400" />
                ) : (
                  <XCircleIcon size={20} weight="fill" className="shrink-0 text-status-critical" />
                ))}
            </div>
          </div>

          <Button
            variant="outline"
            className="font-mono text-xs uppercase tracking-widest"
            onClick={handleRunTests}
            disabled={productionUrl.length === 0 || isTesting}
            aria-label="onboarding-production-run-scenarios"
          >
            {isTesting ? "running..." : "run scenarios in production"}
          </Button>
        </section>

        {/* Error message */}
        {anyFailed && (
          <section>
            <div className="border border-status-critical/30 bg-status-critical/5 p-4">
              <div className="font-mono text-sm font-medium text-status-critical">
                Not all scenarios passed in production.
              </div>
              <div className="mt-1 font-mono text-2xs text-status-critical/80">
                Fix the failing scenarios and run tests again. All scenarios must pass to continue.
              </div>
            </div>
          </section>
        )}

        {/* Complete - only when all pass */}
        {allPassed && (
          <div className="flex justify-end pt-4">
            <Button
              variant="accent"
              className="gap-3 px-8 py-4 font-mono text-sm font-bold uppercase"
              onClick={handleComplete}
              disabled={completeOnboarding.isPending}
              aria-label="onboarding-production-complete"
            >
              {completeOnboarding.isPending ? "completing..." : "COMPLETE"}
              <ArrowRightIcon size={18} weight="bold" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

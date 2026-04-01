import { Button, Checkbox } from "@autonoma/blacklight";
import { ArrowRightIcon } from "@phosphor-icons/react/ArrowRight";
import { CheckCircleIcon } from "@phosphor-icons/react/CheckCircle";
import { XCircleIcon } from "@phosphor-icons/react/XCircle";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useSetNgrokUrl, useTestScenariosNgrok } from "lib/onboarding/onboarding-api";
import { sounds } from "lib/onboarding/sounds";
import { toastManager } from "lib/toast-manager";
import type { RouterOutputs } from "lib/trpc";
import { useRef, useState } from "react";
import { CodeBlock } from "./-components/code-block";

type ScenarioTestResult = RouterOutputs["onboarding"]["testScenariosNgrok"]["results"][number];

export const Route = createFileRoute("/_blacklight/onboarding/scenarios")({
  component: ScenariosPage,
});

const CODEBASE_PROMPT = "`/autonoma-e2e deploy --scenarios standard,empty,large`";

function MockAppRow({ width, opacity }: { width: string; opacity: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className={`h-2 rounded-full bg-text-tertiary ${width} ${opacity}`} />
      <div className="h-2 flex-1 rounded-full bg-border-dim opacity-40" />
    </div>
  );
}

function ScenarioCard({
  title,
  subtitle,
  density,
}: {
  title: string;
  subtitle: string;
  density: "full" | "medium" | "empty";
}) {
  return (
    <div className="flex flex-col overflow-hidden border border-border-dim bg-surface-base">
      <div className="flex items-center gap-1.5 border-b border-border-dim bg-surface-raised px-3 py-2">
        <div className="size-1.5 rounded-full bg-border-dim" />
        <div className="size-1.5 rounded-full bg-border-dim" />
        <div className="size-1.5 rounded-full bg-border-dim" />
        <div className="ml-2 h-1.5 w-16 rounded-full bg-border-dim opacity-50" />
      </div>
      <div className="flex min-h-32">
        <div className="flex w-10 shrink-0 flex-col gap-2 border-r border-border-dim bg-surface-void p-2 pt-3">
          <div className="h-1.5 w-full rounded-full bg-border-dim opacity-60" />
          <div className="h-1.5 w-3/4 rounded-full bg-primary-ink/30" />
          <div className="h-1.5 w-full rounded-full bg-border-dim opacity-40" />
          <div className="h-1.5 w-2/3 rounded-full bg-border-dim opacity-40" />
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          {density === "full" && (
            <>
              <MockAppRow width="w-1/3" opacity="opacity-70" />
              <MockAppRow width="w-1/2" opacity="opacity-60" />
              <MockAppRow width="w-2/5" opacity="opacity-50" />
              <MockAppRow width="w-1/4" opacity="opacity-60" />
              <MockAppRow width="w-1/3" opacity="opacity-40" />
              <MockAppRow width="w-2/3" opacity="opacity-50" />
              <MockAppRow width="w-1/4" opacity="opacity-40" />
            </>
          )}
          {density === "medium" && (
            <>
              <MockAppRow width="w-1/3" opacity="opacity-60" />
              <MockAppRow width="w-1/2" opacity="opacity-50" />
              <MockAppRow width="w-1/4" opacity="opacity-40" />
              <div className="mt-1 h-2 w-2/3 rounded-full bg-border-dim opacity-20" />
            </>
          )}
          {density === "empty" && (
            <div className="flex flex-1 items-center justify-center">
              <div className="h-2 w-2/3 rounded-full bg-border-dim opacity-20" />
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-border-dim px-3 py-2.5">
        <p className="font-mono text-3xs font-medium uppercase tracking-widest text-text-primary">{title}</p>
        <p className="mt-0.5 font-mono text-4xs text-text-tertiary">{subtitle}</p>
      </div>
    </div>
  );
}

function ScenariosPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"understand" | "test">("understand");
  const [codebaseRun, setCodebaseRun] = useState(false);
  const testSectionRef = useRef<HTMLElement>(null);
  const [ngrokUrl, setNgrokUrl] = useState("");
  const [testResults, setTestResults] = useState<ScenarioTestResult[]>([]);
  const [hasTestedNgrok, setHasTestedNgrok] = useState(false);

  const setNgrokUrlMutation = useSetNgrokUrl();
  const testScenariosNgrok = useTestScenariosNgrok();

  const allNgrokPassed = hasTestedNgrok && testResults.length === 3 && testResults.every((r) => r.passed);
  const isTesting = testScenariosNgrok.isPending || setNgrokUrlMutation.isPending;

  function handleTestNgrok() {
    if (ngrokUrl.length === 0) return;
    setNgrokUrlMutation.mutate(
      { url: ngrokUrl },
      {
        onSuccess: () => {
          testScenariosNgrok.mutate(
            { ngrokUrl },
            {
              onSuccess: (data) => {
                setTestResults(data.results);
                setHasTestedNgrok(true);
                const allPassed = data.results.every((r) => r.passed);
                if (allPassed) {
                  sounds.success();
                  toastManager.add({ title: "All scenarios passed", type: "success" });
                } else {
                  sounds.error();
                  toastManager.add({ title: "Some scenarios failed", type: "warning" });
                }
              },
            },
          );
        },
      },
    );
  }

  function handleContinue() {
    void navigate({ to: "/onboarding/production" });
  }

  return (
    <div className="py-16">
      <header className="mb-10 border-b border-border-dim pb-8">
        <div className="flex items-start justify-between">
          <h1 className="text-4xl font-medium tracking-tight text-text-primary">Test Your Scenarios</h1>
          <a
            href="https://docs.agent.autonoma.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-3xs uppercase tracking-wider text-primary-ink opacity-70 hover:opacity-100"
          >
            learn more
          </a>
        </div>
      </header>

      <div className="space-y-14">
        {/* What is a scenario */}
        <section>
          <h2 className="mb-3 font-mono text-2xs uppercase tracking-widest text-text-tertiary">What is a scenario?</h2>
          <p className="max-w-2xl text-sm leading-relaxed text-text-secondary">
            A scenario is a snapshot of your application loaded with specific seed data. Autonoma tests each scenario as
            a distinct state - a busy app with lots of data, a typical usage pattern, and a near-empty first-run
            experience - to ensure every path works correctly.
          </p>
        </section>

        {/* 3 Scenario cards */}
        <section>
          <h2 className="mb-6 font-mono text-2xs uppercase tracking-widest text-text-tertiary">Your 3 Scenarios</h2>
          <div className="grid grid-cols-3 gap-5">
            <ScenarioCard
              title="Large dataset"
              subtitle="Hundreds of records, full tables, pagination"
              density="full"
            />
            <ScenarioCard title="Standard flow" subtitle="Typical user with moderate data" density="medium" />
            <ScenarioCard title="Empty state" subtitle="First-run experience, no data seeded" density="empty" />
          </div>
        </section>

        {/* Add to codebase */}
        <section>
          <h2 className="mb-3 font-mono text-2xs uppercase tracking-widest text-text-tertiary">Add to your codebase</h2>
          <p className="mb-4 text-sm text-text-secondary">
            Run this command in your project root to deploy the 3 scenarios Autonoma generated for you.
          </p>
          <div className="max-w-lg">
            <CodeBlock>{CODEBASE_PROMPT}</CodeBlock>
          </div>
          <label htmlFor="codebaseRun" className="mt-4 flex cursor-pointer items-center gap-3">
            <Checkbox
              id="codebaseRun"
              checked={codebaseRun}
              onCheckedChange={(checked) => setCodebaseRun(checked === true)}
            />
            <span className="font-mono text-sm text-text-secondary">I&apos;ve run this in my codebase</span>
          </label>

          {/* Understood button - gates to next substep */}
          <div className="mt-6">
            <Button
              variant="accent"
              className="gap-2 px-8 py-3 font-mono text-sm font-bold uppercase"
              disabled={!codebaseRun || step === "test"}
              aria-label="onboarding-scenarios-understood"
              onClick={() => {
                setStep("test");
                setTimeout(() => {
                  testSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                }, 50);
              }}
            >
              Understood
              <ArrowRightIcon size={16} weight="bold" />
            </Button>
          </div>
        </section>

        {/* Substep 2: Test with accessible URLs */}
        {step === "test" && (
          <section ref={testSectionRef} className="space-y-6 border-t border-border-dim pt-10">
            <div>
              <h2 className="mb-1 font-mono text-2xs uppercase tracking-widest text-text-tertiary">
                Test your scenarios
              </h2>
              <p className="max-w-2xl text-sm text-text-secondary">
                Provide an accessible URL for your application. We suggest using{" "}
                <a
                  href="https://ngrok.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-ink hover:underline"
                >
                  ngrok
                </a>{" "}
                to expose your local server, but any publicly accessible link will work.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="ngrok-url" className="font-mono text-2xs uppercase tracking-widest text-text-tertiary">
                Ngrok URL
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="url"
                  id="ngrok-url"
                  value={ngrokUrl}
                  onChange={(e) => setNgrokUrl(e.target.value)}
                  placeholder="https://xxxx.ngrok.io"
                  className="w-full max-w-lg border border-border-dim bg-surface-base px-4 py-2.5 font-mono text-sm text-text-primary placeholder-text-tertiary/50 outline-none focus:border-primary-ink/50"
                />
                {hasTestedNgrok &&
                  (allNgrokPassed ? (
                    <CheckCircleIcon size={20} weight="fill" className="shrink-0 text-lime-400" />
                  ) : (
                    <XCircleIcon size={20} weight="fill" className="shrink-0 text-status-critical" />
                  ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="font-mono text-xs uppercase tracking-widest"
              onClick={handleTestNgrok}
              disabled={ngrokUrl.length === 0 || isTesting}
              aria-label="onboarding-scenarios-test-ngrok"
            >
              {isTesting ? "testing..." : "test scenarios"}
            </Button>

            {allNgrokPassed && (
              <div className="flex justify-end pt-2">
                <Button
                  variant="accent"
                  className="gap-3 px-8 py-4 font-mono text-sm font-bold uppercase"
                  onClick={handleContinue}
                  aria-label="onboarding-scenarios-continue-production"
                >
                  CONTINUE TO PRODUCTION
                  <ArrowRightIcon size={18} weight="bold" />
                </Button>
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

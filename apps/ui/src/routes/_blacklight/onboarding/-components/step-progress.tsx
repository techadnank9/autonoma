import { cn } from "@autonoma/blacklight";

const STEPS = [
  { num: "01", label: "Install Plugin" },
  { num: "02", label: "Configure" },
  { num: "03", label: "Generation" },
  { num: "04", label: "App URL" },
] as const;

interface StepProgressProps {
  currentStep: number;
  onStepClick?: (index: number) => void;
}

export function StepProgress({ currentStep, onStepClick }: StepProgressProps) {
  return (
    <div className="flex flex-col">
      {STEPS.map((step, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const isClickable = isCompleted && onStepClick != null;
        const isLast = index === STEPS.length - 1;

        return (
          <div
            key={step.num}
            className={cn("flex gap-5", isClickable && "cursor-pointer group")}
            onClick={() => isClickable && onStepClick(index)}
          >
            {/* Timeline column */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full transition-colors",
                  isActive && "bg-primary-ink shadow-[0_0_8px_var(--accent-glow)]",
                  isCompleted && "bg-primary-ink",
                  !isActive && !isCompleted && "border border-border-dim bg-surface-void",
                )}
              />
              {!isLast && (
                <div
                  className={cn(
                    "my-1 w-px flex-1 transition-colors",
                    isActive && "bg-primary-ink shadow-[0_0_10px_var(--accent-glow)]",
                    isCompleted && "bg-primary-ink/40",
                    !isActive && !isCompleted && "bg-border-dim",
                  )}
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("flex flex-col gap-1 pb-10", isLast && "pb-0")}>
              <span
                className={cn(
                  "font-mono text-3xs tracking-widest transition-colors",
                  isActive
                    ? "text-primary-ink"
                    : isClickable
                      ? "text-text-tertiary group-hover:text-primary-ink/60"
                      : "text-text-tertiary",
                )}
              >
                {step.num}
              </span>
              <span
                className={cn(
                  "text-sm font-medium tracking-wide transition-colors",
                  isActive
                    ? "text-text-primary"
                    : isClickable
                      ? "text-text-secondary group-hover:text-text-primary"
                      : "text-text-secondary",
                )}
              >
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

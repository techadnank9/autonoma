import { ArrowDown } from "@phosphor-icons/react/ArrowDown";
import { ArrowUp } from "@phosphor-icons/react/ArrowUp";
import { Minus } from "@phosphor-icons/react/Minus";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

function MetricCard({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="metric-card" className={cn("flex flex-col gap-3", className)} {...props} />;
}

function MetricLabel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric-label"
      className={cn(
        "flex items-center justify-between border-b border-dotted border-border-dim pb-2 font-mono text-4xs uppercase tracking-widest text-text-secondary",
        className,
      )}
      {...props}
    />
  );
}

function MetricValue({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="metric-value"
      className={cn("font-mono text-3xl font-extrabold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function MetricUnit({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span data-slot="metric-unit" className={cn("ml-1 text-sm font-normal text-text-tertiary", className)} {...props} />
  );
}

const metricTrendVariants = cva("inline-flex items-center gap-1 font-mono text-4xs font-bold", {
  variants: {
    direction: {
      up: "text-primary-ink",
      down: "text-status-critical",
      neutral: "text-text-tertiary",
    },
  },
  defaultVariants: {
    direction: "neutral",
  },
});

const TREND_ICONS = {
  up: ArrowUp,
  down: ArrowDown,
  neutral: Minus,
} as const;

function MetricTrend({
  className,
  direction = "neutral",
  value,
  children,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof metricTrendVariants> & {
    value?: string;
  }) {
  const TrendIcon = TREND_ICONS[direction ?? "neutral"];

  return (
    <span
      data-slot="metric-trend"
      data-direction={direction}
      className={cn(metricTrendVariants({ direction }), className)}
      {...props}
    >
      <TrendIcon className="size-3" weight="bold" />
      {value}
      {children}
    </span>
  );
}

export { MetricCard, MetricLabel, MetricValue, MetricUnit, MetricTrend, metricTrendVariants };

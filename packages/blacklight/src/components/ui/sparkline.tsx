import type * as React from "react";

import { cn } from "../../lib/utils";

interface SparklineProps extends React.ComponentProps<"svg"> {
  /** Array of numeric values to plot */
  data: number[];
  /** Stroke color - defaults to var(--chart-1) */
  color?: string;
  /** Show filled area below the line */
  filled?: boolean;
}

function buildPolyline(data: number[], width: number, height: number): string {
  if (data.length === 0) return "";

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = width / Math.max(data.length - 1, 1);

  return data
    .map((v, i) => {
      const x = i * step;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");
}

function Sparkline({ data, color = "var(--text-secondary)", filled = false, className, ...props }: SparklineProps) {
  const vw = 80;
  const vh = 24;
  const points = buildPolyline(data, vw, vh);

  return (
    <svg
      data-slot="sparkline"
      role="img"
      aria-label="sparkline"
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="none"
      className={cn("h-5 w-16", className)}
      {...props}
    >
      {filled && points && <polygon points={`0,${vh} ${points} ${vw},${vh}`} fill={color} opacity={0.15} />}
      {points && (
        <polyline points={points} fill="none" stroke={color} strokeWidth={1.5} vectorEffect="non-scaling-stroke" />
      )}
    </svg>
  );
}

export { Sparkline, type SparklineProps };

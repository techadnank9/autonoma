import "./logo.css";

import type { CSSProperties } from "react";
import { cn } from "../lib/utils";

/* ═══════════════════════════════════════════
   Blacklight Logo - SVG symbol with variants
   ═══════════════════════════════════════════ */

type LogoVariant = "full" | "symbol" | "mark" | "wordmark" | "spinner";

interface LogoProps {
  /** Which visual variant to render */
  variant?: LogoVariant;
  /** Enable ray pulse animation (only applies to "full" variant) */
  animate?: boolean;
  /** Use monochrome mode (inherits currentColor, no glow) */
  monochrome?: boolean;
  /**
   * Override the logo color. Applies to strokes, fills, and text.
   * Also enables monochrome mode automatically.
   */
  color?: string;
  /** Scale factor for stroke widths (1 = default, 2 = double, etc.) */
  strokeWidth?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Core eye shape shared across all variants.
 * Renders the hexagonal core, diamond iris, and diamond pupil.
 */
function CoreShape({ iris = true, pupil = true }: { iris?: boolean; pupil?: boolean }) {
  return (
    <>
      <polygon className="svg-core-shape" points="-75,0 -35,-45 35,-45 75,0 35,45 -35,45" />
      {iris && <polygon className="svg-iris" points="-25,0 0,-30 25,0 0,30" />}
      {pupil && <polygon className="svg-pupil" points="-8,0 0,-12 8,0 0,12" />}
    </>
  );
}

/** Construction grid lines (shown in "full" variant) */
function ConstructionGrid() {
  return (
    <g className="svg-construction">
      <line x1="-100" y1="0" x2="100" y2="0" />
      <line x1="0" y1="-100" x2="0" y2="100" />
      <polygon points="-80,-80 80,-80 80,80 -80,80" fill="none" />
      <line x1="-80" y1="-80" x2="80" y2="80" />
      <line x1="-80" y1="80" x2="80" y2="-80" />
      <polygon points="0,-90 90,0 0,90 -90,0" />
    </g>
  );
}

/** Ray lines emanating from the eye (shown in "full" variant) */
function Rays() {
  return (
    <>
      <g className="svg-ray-dashed">
        <line x1="0" y1="-30" x2="0" y2="-95" />
        <line x1="0" y1="30" x2="0" y2="95" />
        <line x1="-30" y1="0" x2="-95" y2="0" />
        <line x1="30" y1="0" x2="95" y2="0" />
      </g>
      <g className="svg-ray">
        <line x1="-20" y1="-20" x2="-65" y2="-65" />
        <line x1="20" y1="-20" x2="65" y2="-65" />
        <line x1="-20" y1="20" x2="-65" y2="65" />
        <line x1="20" y1="20" x2="65" y2="65" />
      </g>
    </>
  );
}

function buildLogoStyle(color?: string, strokeWidth?: number): CSSProperties | undefined {
  if (color == null && strokeWidth == null) return undefined;
  return {
    ...(color != null ? { color } : {}),
    ...(strokeWidth != null ? { "--logo-stroke-scale": strokeWidth } : {}),
  } as CSSProperties;
}

/**
 * Blacklight Logo component.
 *
 * Variants:
 * - `full`     - Construction grid + rays + core shape + iris + pupil. For hero/cover use.
 * - `symbol`   - Core shape + iris + pupil. Default. For nav bars, headers, avatars.
 * - `mark`     - Core shape only (no iris/pupil). Minimal favicon-style mark.
 * - `wordmark` - Eye symbol + "BLACKLIGHT" text. For branding, headers.
 * - `spinner`  - Animated scanning/loading indicator with orbit rings.
 */
function Logo({ variant = "symbol", animate = false, monochrome = false, color, strokeWidth, className }: LogoProps) {
  if (variant === "spinner") {
    return <LogoSpinner className={className} />;
  }

  if (variant === "wordmark") {
    return <LogoWordmark color={color} strokeWidth={strokeWidth} monochrome={monochrome} className={className} />;
  }

  const isFull = variant === "full";
  const useMonochrome = monochrome || color != null;

  return (
    <svg
      className={cn("logo-mark", isFull && animate && "animate-rays", useMonochrome && "logo-monochrome", className)}
      viewBox="-100 -100 200 200"
      role="img"
      aria-label="Blacklight logo"
      style={buildLogoStyle(color, strokeWidth)}
    >
      {isFull && <ConstructionGrid />}
      {isFull && <Rays />}
      <CoreShape iris={variant !== "mark"} pupil={variant !== "mark"} />
    </svg>
  );
}

/** Eye symbol + "BLACKLIGHT" text wordmark */
function LogoWordmark({
  color,
  strokeWidth,
  monochrome = false,
  className,
}: { color?: string; strokeWidth?: number; monochrome?: boolean; className?: string }) {
  const useMonochrome = monochrome || color != null;
  const textColor = color ?? "currentColor";

  return (
    <div
      className={cn("inline-flex items-center gap-[0.5em]", className)}
      style={color != null ? ({ color } as CSSProperties) : undefined}
    >
      <svg
        className={cn("logo-mark size-[1.4em] shrink-0", useMonochrome && "logo-monochrome")}
        viewBox="-100 -100 200 200"
        role="img"
        aria-label="Blacklight logo"
        style={buildLogoStyle(color, strokeWidth)}
      >
        <CoreShape />
      </svg>
      <span
        className="whitespace-nowrap font-mono font-semibold uppercase leading-none tracking-tight"
        style={{ color: textColor }}
      >
        Blacklight
      </span>
    </div>
  );
}

/** Animated orbiting eye spinner variant */
function LogoSpinner({ className }: { className?: string }) {
  return (
    <div className={cn("relative size-12", className)}>
      <svg
        className="logo-mark size-full"
        viewBox="-100 -100 200 200"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        {/* Spinning iris + pupil with opacity pulse */}
        <g style={{ transformOrigin: "0 0", animation: "bl-orbit 2.5s linear infinite" }}>
          <polygon
            points="-25,0 0,-30 25,0 0,30"
            className="svg-iris"
            style={{ animation: "bl-pulse-opacity 2s ease-in-out infinite" }}
          />
          <polygon
            points="-8,0 0,-12 8,0 0,12"
            className="svg-pupil"
            style={{ animation: "bl-pulse-opacity 2s ease-in-out infinite" }}
          />
        </g>
      </svg>
    </div>
  );
}

export { Logo, type LogoProps, type LogoVariant };

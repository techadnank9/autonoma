import { cn } from "../../lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Visual state of the Autonoma Agent cube.
 *
 * - `idle`       — Agent is standing by. Very slow, dim. Default.
 * - `processing` — Light background work (e.g. queuing a run).
 * - `analyzing`  — Actively inspecting a screenshot or output.
 * - `working`    — Executing a test generation. Fast, fully lit.
 * - `success`    — Last operation completed successfully. Green.
 * - `failed`     — Last operation failed. Red.
 */
export type AgentCubeState = "idle" | "processing" | "analyzing" | "working" | "success" | "failed";

export interface AgentCubeProps {
  /** Visual state driving animation speed, color and brightness. @default "idle" */
  state?: AgentCubeState;
  /** Pixel size of the cube (width = height). @default 20 */
  size?: number;
  className?: string;
}

// ─── State config ─────────────────────────────────────────────────────────────

/** Animation duration per state — slower = calmer, faster = intense */
const STATE_DURATION: Record<AgentCubeState, string> = {
  idle: "22s",
  processing: "7s",
  analyzing: "4.5s",
  working: "4s",
  success: "5s",
  failed: "18s",
};

/** Hex color per state */
const STATE_COLOR: Record<AgentCubeState, string> = {
  idle: "#a3b818", // primary (lime)
  processing: "#38bdf8", // sky-400
  analyzing: "#fbbf24", // amber-400
  working: "#a3e635", // lime-400
  success: "#4ade80", // green-400
  failed: "#f87171", // red-400
};

/** Edge opacity per state */
const STATE_OPACITY: Record<AgentCubeState, number> = {
  idle: 0.25,
  processing: 0.6,
  analyzing: 0.75,
  working: 0.9,
  success: 0.7,
  failed: 0.7,
};

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * Flat 2D wireframe cube using two overlapping squares with offset rotation.
 * No `preserve-3d` or `perspective` - avoids Chromium GPU compositing bugs.
 */
export function AgentCube({ state = "idle", size = 20, className }: AgentCubeProps) {
  const color = STATE_COLOR[state];
  const duration = STATE_DURATION[state];
  const opacity = STATE_OPACITY[state];

  /** Inset for the inner square (gives depth illusion) */
  const inset = Math.round(size * 0.18);

  return (
    <div className={cn("shrink-0", className)} style={{ width: size, height: size, position: "relative" }}>
      {/* Outer square - rotates forward */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          border: `1px solid ${color}`,
          opacity,
          animation: `bl-cube-spin ${duration} linear infinite`,
        }}
      />
      {/* Inner square - rotates backward, offset creates depth */}
      <div
        style={{
          position: "absolute",
          inset,
          border: `1px solid ${color}`,
          opacity: opacity * 0.5,
          animation: `bl-cube-spin ${duration} linear infinite reverse`,
        }}
      />
    </div>
  );
}

// ─── State metadata ───────────────────────────────────────────────────────────

/** Human-readable label for each agent state */
export const AGENT_CUBE_STATE_LABEL: Record<AgentCubeState, string> = {
  idle: "Standby",
  processing: "Processing",
  analyzing: "Analyzing",
  working: "Working",
  success: "Done",
  failed: "Error",
};

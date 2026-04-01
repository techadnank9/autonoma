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
  working: "2.2s",
  success: "5s",
  failed: "18s",
};

/** Base CSS color expression per state */
const STATE_COLOR: Record<AgentCubeState, string> = {
  idle: "var(--primary)",
  processing: "var(--primary)",
  analyzing: "var(--primary)",
  working: "var(--primary)",
  success: "var(--status-success)",
  failed: "var(--status-critical)",
};

/**
 * Per-state edge opacity (0–1). Scaled per-face for depth perception.
 * No filled backgrounds — pure wireframe avoids GPU compositing layer bleed.
 */
const STATE_OPACITY: Record<AgentCubeState, number> = {
  idle: 0.18,
  processing: 0.5,
  analyzing: 0.7,
  working: 0.95,
  success: 0.72,
  failed: 0.75,
};

/**
 * Per-face depth multipliers — front is brightest, bottom is dimmest.
 * Order: front, back, left, right, top, bottom.
 */
const FACE_MULTIPLIERS = [0.8, 0.38, 0.52, 0.52, 0.42, 0.28] as const;

// ─── Component ────────────────────────────────────────────────────────────────

export function AgentCube({ state = "idle", size = 20, className }: AgentCubeProps) {
  const half = size / 2;
  const color = STATE_COLOR[state];
  const duration = STATE_DURATION[state];
  const edgeBase = STATE_OPACITY[state];

  const faceTransforms = [
    `rotateY(0deg)   translateZ(${half}px)`, // front
    `rotateY(180deg) translateZ(${half}px)`, // back
    `rotateY(-90deg) translateZ(${half}px)`, // left
    `rotateY(90deg)  translateZ(${half}px)`, // right
    `rotateX(90deg)  translateZ(${half}px)`, // top
    `rotateX(-90deg) translateZ(${half}px)`, // bottom
  ] as const;

  return (
    <div className={cn("shrink-0", className)} style={{ width: size, height: size }}>
      {/* Perspective wrapper */}
      <div
        style={{
          width: "100%",
          height: "100%",
          perspective: `${size * 2.8}px`,
        }}
      >
        {/* Spinning cube */}
        <div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            animation: `bl-cube-spin ${duration} linear infinite`,
          }}
        >
          {faceTransforms.map((transform, i) => {
            const mul = FACE_MULTIPLIERS[i] ?? 0.5;
            const edgePct = Math.round(mul * edgeBase * 100);
            return (
              <div
                key={transform}
                style={{
                  position: "absolute",
                  inset: 0,
                  border: `1px solid color-mix(in srgb, ${color} ${edgePct}%, transparent)`,
                  transform,
                }}
              />
            );
          })}
        </div>
      </div>
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

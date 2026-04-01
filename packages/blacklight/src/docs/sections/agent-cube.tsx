import { AGENT_CUBE_STATE_LABEL, AgentCube, type AgentCubeState } from "@/components/ui/agent-cube";
import {
  Code,
  CodeBlock,
  Paragraph,
  PreviewBox,
  PropRow,
  PropTable,
  SectionDesc,
  SectionTitle,
  SubTitle,
} from "../components/atoms";

const ALL_STATES: AgentCubeState[] = ["idle", "processing", "analyzing", "working", "success", "failed"];

const STATE_DESCRIPTIONS: Record<AgentCubeState, string> = {
  idle: "Agent is standing by. Very slow rotation, barely visible. Default.",
  processing: "Light background work — e.g. queuing a run or waiting for a slot.",
  analyzing: "Actively inspecting a screenshot, output, or element tree.",
  working: "Executing a test generation. Fast, fully lit, strong glow.",
  success: "Last operation completed successfully. Green tint.",
  failed: "Last operation failed or errored. Red tint, nearly stopped.",
};

export function AgentCubeSection() {
  return (
    <>
      <SectionTitle>Agent Cube</SectionTitle>
      <SectionDesc>
        A 3D CSS cube representing the Autonoma Agent. Conveys agent status through animation speed, face brightness,
        and color — without any text or icons. Lives in the sidebar footer.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">AgentCube</span>
        {", "}
        <span className="text-chart-3">AGENT_CUBE_STATE_LABEL</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      {/* ── All states side by side ── */}
      <SubTitle>States</SubTitle>
      <Paragraph>
        Each state changes animation speed, face opacity, color, and glow intensity. Pass the <Code>state</Code> prop to
        control which visual is shown. The cube will transition smoothly between states as the prop changes.
      </Paragraph>

      <PreviewBox className="flex flex-col gap-8">
        {ALL_STATES.map((state) => (
          <div key={state} className="flex items-start gap-6">
            {/* Cube at multiple sizes to show scaling */}
            <div className="flex items-center gap-4">
              <AgentCube state={state} size={14} />
              <AgentCube state={state} size={20} />
              <AgentCube state={state} size={28} />
              <AgentCube state={state} size={40} />
            </div>
            {/* State info */}
            <div className="min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <code className="font-mono text-2xs font-bold text-primary-ink">{state}</code>
                <span className="font-mono text-3xs text-text-tertiary">— {AGENT_CUBE_STATE_LABEL[state]}</span>
              </div>
              <p className="mt-1 font-mono text-3xs text-text-tertiary">{STATE_DESCRIPTIONS[state]}</p>
            </div>
          </div>
        ))}
      </PreviewBox>

      {/* ── Sidebar context ── */}
      <SubTitle>Sidebar Context</SubTitle>
      <Paragraph>As rendered in the sidebar footer — expanded and collapsed variants side by side.</Paragraph>

      <PreviewBox className="flex items-start gap-8">
        {/* Expanded sidebar footer mock */}
        <div className="w-48 border border-border-dim bg-surface-base">
          {ALL_STATES.map((state) => (
            <div key={state} className="flex items-center gap-3 border-b border-border-dim px-4 py-2.5 last:border-b-0">
              <AgentCube state={state} size={18} />
              <div className="min-w-0">
                <p className="text-2xs font-medium text-text-secondary">Autonoma Agent</p>
                <p className="font-mono text-3xs text-text-tertiary">{AGENT_CUBE_STATE_LABEL[state]}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Collapsed sidebar footer mock */}
        <div className="w-12 border border-border-dim bg-surface-base">
          {ALL_STATES.map((state) => (
            <div
              key={state}
              className="flex items-center justify-center border-b border-border-dim py-3 last:border-b-0"
            >
              <AgentCube state={state} size={18} />
            </div>
          ))}
        </div>
      </PreviewBox>

      {/* ── Size scale ── */}
      <SubTitle>Size Scale</SubTitle>
      <Paragraph>
        The <Code>size</Code> prop controls both width and height in pixels. The cube automatically adjusts perspective
        depth and face translate distances to maintain correct proportions at any size.
      </Paragraph>

      <PreviewBox>
        <div className="flex items-end gap-8">
          {([12, 16, 20, 28, 36, 48, 64] as const).map((size) => (
            <div key={size} className="flex flex-col items-center gap-3">
              <AgentCube state="working" size={size} />
              <span className="font-mono text-3xs text-text-tertiary">{size}px</span>
            </div>
          ))}
        </div>
      </PreviewBox>

      {/* ── Props ── */}
      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow
          name="state"
          type="AgentCubeState"
          def='"idle"'
          desc='Visual state — controls speed, color and brightness. One of: "idle" | "processing" | "analyzing" | "working" | "success" | "failed"'
        />
        <PropRow
          name="size"
          type="number"
          def="20"
          desc="Pixel size (width = height). Perspective and face depths scale automatically."
        />
        <PropRow name="className" type="string" def="-" desc="Additional classes applied to the outer wrapper div." />
      </PropTable>

      {/* ── AGENT_CUBE_STATE_LABEL ── */}
      <SubTitle>AGENT_CUBE_STATE_LABEL</SubTitle>
      <Paragraph>
        A record mapping each <Code>AgentCubeState</Code> to its human-readable label. Use alongside the cube in UI
        surfaces like the sidebar footer.
      </Paragraph>

      <CodeBlock label="USAGE">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">AgentCube</span>
        {", "}
        <span className="text-chart-3">AGENT_CUBE_STATE_LABEL</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
        {"\n\n"}
        {"<"}
        <span className="text-primary-ink">div</span> <span className="text-chart-3">className</span>
        {'="flex items-center gap-3">'}
        {"\n"}
        {"  <"}
        <span className="text-primary-ink">AgentCube</span> <span className="text-chart-3">state</span>
        {"={state}"} <span className="text-chart-3">size</span>
        {"={18} />"}
        {"\n"}
        {"  <"}
        <span className="text-primary-ink">span</span>
        {">"}
        {"{AGENT_CUBE_STATE_LABEL[state]}</"}
        <span className="text-primary-ink">span</span>
        {">"}
        {"\n"}
        {"</"}
        <span className="text-primary-ink">div</span>
        {">"}
      </CodeBlock>

      <PreviewBox>
        <div className="flex flex-col gap-2">
          {ALL_STATES.map((state) => (
            <div key={state} className="flex items-center gap-3">
              <AgentCube state={state} size={18} />
              <span className="font-mono text-2xs text-text-secondary">{AGENT_CUBE_STATE_LABEL[state]}</span>
              <span className="ml-auto font-mono text-3xs text-text-tertiary">state=&quot;{state}&quot;</span>
            </div>
          ))}
        </div>
      </PreviewBox>
    </>
  );
}

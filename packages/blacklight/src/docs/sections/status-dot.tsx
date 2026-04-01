import { StatusDot } from "@/components/ui/status-dot";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function StatusDotSection() {
  return (
    <>
      <SectionTitle>Status Dot</SectionTitle>
      <SectionDesc>
        Tiny colored indicator for status representation. Use alongside text labels for at-a-glance status.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">StatusDot</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Variants</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <StatusDot status="success" />
            <span className="font-mono text-2xs text-text-secondary">Success</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="warn" />
            <span className="font-mono text-2xs text-text-secondary">Warning</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="critical" />
            <span className="font-mono text-2xs text-text-secondary">Critical</span>
          </div>
          <div className="flex items-center gap-2">
            <StatusDot status="neutral" />
            <span className="font-mono text-2xs text-text-secondary">Neutral</span>
          </div>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow
          name="status"
          type='"success" | "warn" | "critical" | "neutral"'
          def='"neutral"'
          desc="Status color variant"
        />
      </PropTable>
    </>
  );
}

export default StatusDotSection;

import { Sparkline } from "@/components/ui/sparkline";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

const SAMPLE_UP = [12, 15, 14, 18, 22, 25, 28, 30, 35, 38];
const SAMPLE_DOWN = [40, 38, 35, 30, 28, 25, 22, 18, 15, 12];
const SAMPLE_VOLATILE = [20, 35, 15, 40, 10, 30, 25, 45, 20, 35];

export function SparklineSection() {
  return (
    <>
      <SectionTitle>Sparkline</SectionTitle>
      <SectionDesc>
        Inline SVG sparkline chart for compact trend visualization. Renders as a lightweight polyline.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Sparkline</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Default</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs text-text-secondary">Upward</span>
            <Sparkline data={SAMPLE_UP} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs text-text-secondary">Downward</span>
            <Sparkline data={SAMPLE_DOWN} />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-2xs text-text-secondary">Volatile</span>
            <Sparkline data={SAMPLE_VOLATILE} />
          </div>
        </div>
      </PreviewBox>

      <SubTitle>Colored</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <Sparkline data={SAMPLE_UP} color="var(--status-success)" />
          <Sparkline data={SAMPLE_DOWN} color="var(--status-critical)" />
          <Sparkline data={SAMPLE_VOLATILE} color="var(--primary)" />
        </div>
      </PreviewBox>

      <SubTitle>Filled</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <Sparkline data={SAMPLE_UP} filled color="var(--status-success)" className="h-8 w-24" />
          <Sparkline data={SAMPLE_DOWN} filled color="var(--status-critical)" className="h-8 w-24" />
          <Sparkline data={SAMPLE_VOLATILE} filled color="var(--primary)" className="h-8 w-24" />
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="data" type="number[]" def="-" desc="Array of numeric values to plot" />
        <PropRow name="color" type="string" def="var(--text-secondary)" desc="Stroke color" />
        <PropRow name="filled" type="boolean" def="false" desc="Show filled area below line" />
      </PropTable>
    </>
  );
}

export default SparklineSection;

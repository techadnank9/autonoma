import { MetricCard, MetricLabel, MetricTrend, MetricUnit, MetricValue } from "@/components/ui/metric-card";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function MetricCardSection() {
  return (
    <>
      <SectionTitle>Metric Card</SectionTitle>
      <SectionDesc>
        Compact metric display with label, value, unit, and trend indicator. Designed for dashboards and KPI summaries.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">MetricCard, MetricLabel, MetricValue, MetricUnit, MetricTrend</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Basic</SubTitle>
      <PreviewBox>
        <div className="grid max-w-md grid-cols-2 gap-6">
          <MetricCard>
            <MetricLabel>Pass Rate</MetricLabel>
            <MetricValue>
              94.2<MetricUnit>%</MetricUnit>
            </MetricValue>
          </MetricCard>
          <MetricCard>
            <MetricLabel>Avg Duration</MetricLabel>
            <MetricValue>
              12.8<MetricUnit>s</MetricUnit>
            </MetricValue>
          </MetricCard>
        </div>
      </PreviewBox>

      <SubTitle>Trend Directions</SubTitle>
      <PreviewBox>
        <div className="flex items-end gap-8">
          <MetricCard>
            <MetricLabel>Tests Run</MetricLabel>
            <MetricValue>1,247</MetricValue>
            <MetricTrend direction="up" value="+12%" />
          </MetricCard>
          <MetricCard>
            <MetricLabel>Failures</MetricLabel>
            <MetricValue>23</MetricValue>
            <MetricTrend direction="down" value="-8%" />
          </MetricCard>
          <MetricCard>
            <MetricLabel>Skipped</MetricLabel>
            <MetricValue>5</MetricValue>
            <MetricTrend direction="neutral" value="0%" />
          </MetricCard>
        </div>
      </PreviewBox>

      <SubTitle>Props - MetricTrend</SubTitle>
      <PropTable>
        <PropRow name="direction" type='"up" | "down" | "neutral"' def='"neutral"' desc="Trend direction and color" />
        <PropRow name="value" type="string" def="-" desc="Trend value text" />
      </PropTable>
    </>
  );
}

export default MetricCardSection;

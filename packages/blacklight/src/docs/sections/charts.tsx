import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { CodeBlock, PreviewBox, SectionDesc, SectionTitle, SubTitle, TokenGroup } from "../components/atoms";

const CHART_DATA = [
  { time: "00:00", ingress: 420, egress: 240 },
  { time: "04:00", ingress: 380, egress: 180 },
  { time: "08:00", ingress: 520, egress: 340 },
  { time: "12:00", ingress: 780, egress: 520 },
  { time: "16:00", ingress: 640, egress: 410 },
  { time: "20:00", ingress: 490, egress: 290 },
];

const chartConfig = {
  ingress: { label: "Ingress", color: "var(--chart-1)" },
  egress: { label: "Egress", color: "var(--chart-2)" },
} satisfies ChartConfig;

export function ChartsSection() {
  return (
    <>
      <SectionTitle>Charts</SectionTitle>
      <SectionDesc>
        Recharts wrapper with Blacklight theme integration. Uses the shadcn chart pattern with ChartContainer and
        ChartConfig for automatic theme-aware colors.
      </SectionDesc>

      <SubTitle>Preview</SubTitle>
      <PreviewBox>
        <ChartContainer config={chartConfig} className="h-48 w-full">
          <AreaChart data={CHART_DATA} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area
              type="monotone"
              dataKey="ingress"
              stroke="var(--color-ingress)"
              fill="var(--color-ingress)"
              fillOpacity={0.15}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="egress"
              stroke="var(--color-egress)"
              fill="var(--color-egress)"
              fillOpacity={0.1}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </PreviewBox>

      <SubTitle>Usage</SubTitle>
      <CodeBlock label="USAGE">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">ChartContainer</span>, <span className="text-chart-3">ChartTooltip</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
        {"\n\n"}
        <span className="text-status-critical">const</span> config = {"{"}
        {"\n"}
        {"  ingress: { label: "}
        <span className="text-text-secondary">&quot;Ingress&quot;</span>
        {", color: "}
        <span className="text-text-secondary">&quot;var(--chart-1)&quot;</span>
        {" },\n"}
        {"  egress: { label: "}
        <span className="text-text-secondary">&quot;Egress&quot;</span>
        {", color: "}
        <span className="text-text-secondary">&quot;var(--chart-2)&quot;</span>
        {" },\n"}
        {"}"}
      </CodeBlock>

      <SubTitle>Chart Color Tokens</SubTitle>
      <div className="my-4">
        <TokenGroup
          title="Chart Palette"
          tokens={[
            { name: "--chart-1", desc: "Primary series" },
            { name: "--chart-2", desc: "Secondary series" },
            { name: "--chart-3", desc: "Tertiary series" },
            { name: "--chart-4", desc: "Quaternary series" },
            { name: "--chart-5", desc: "Quinary series" },
          ]}
        />
      </div>

      <Alert variant="info" className="mt-4">
        <AlertTitle>Tip</AlertTitle>
        <AlertDescription>
          See the Telemetry Dashboard at /telemetry for live examples of area charts, composed charts, and data table
          integration.
        </AlertDescription>
      </Alert>
    </>
  );
}

export default ChartsSection;

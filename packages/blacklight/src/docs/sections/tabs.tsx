import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, CodeBlock, Paragraph, PreviewBox, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function TabsSection() {
  return (
    <>
      <SectionTitle>Tabs</SectionTitle>
      <SectionDesc>
        Navigation tabs with two visual variants. Built on Base UI Tab primitives for full accessibility.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Tabs</span>, <span className="text-chart-3">TabsList</span>,{" "}
        <span className="text-chart-3">TabsTrigger</span>, <span className="text-chart-3">TabsContent</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Default Variant</SubTitle>
      <Paragraph>The default variant uses a filled background toggle for the active tab.</Paragraph>
      <PreviewBox>
        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">
            <div className="mt-3 font-mono text-2xs text-text-secondary">
              System overview panel displaying aggregate health metrics across all monitored services.
            </div>
          </TabsContent>
          <TabsContent value="metrics">
            <div className="mt-3 font-mono text-2xs text-text-secondary">
              Real-time performance metrics with 15-second resolution. CPU, memory, and network throughput.
            </div>
          </TabsContent>
          <TabsContent value="logs">
            <div className="mt-3 font-mono text-2xs text-text-secondary">
              Aggregated log stream from all services. Filterable by severity, service, and time range.
            </div>
          </TabsContent>
        </Tabs>
      </PreviewBox>

      <SubTitle>Line Variant</SubTitle>
      <Paragraph>
        The <Code>line</Code> variant uses a bottom accent border with glow effect. Preferred for page-level navigation.
      </Paragraph>
      <PreviewBox>
        <Tabs defaultValue="web">
          <TabsList variant="line">
            <TabsTrigger value="web">Web</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>
          <TabsContent value="web">
            <div className="mt-3 font-mono text-2xs text-text-secondary">
              Playwright-based web engine. Supports Chrome, Firefox, and WebKit.
            </div>
          </TabsContent>
          <TabsContent value="mobile">
            <div className="mt-3 font-mono text-2xs text-text-secondary">
              Appium-based mobile engine. Supports iOS and Android on real devices and emulators.
            </div>
          </TabsContent>
          <TabsContent value="api">
            <div className="mt-3 font-mono text-2xs text-text-secondary">
              REST and GraphQL endpoint testing with automatic schema validation.
            </div>
          </TabsContent>
        </Tabs>
      </PreviewBox>
    </>
  );
}

export default TabsSection;

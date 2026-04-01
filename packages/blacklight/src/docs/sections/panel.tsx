import { Panel, PanelBody, PanelHeader, PanelTitle } from "@/components/ui/panel";
import { StatusDot } from "@/components/ui/status-dot";
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

export function PanelSection() {
  return (
    <>
      <SectionTitle>Panel</SectionTitle>
      <SectionDesc>
        Container with corner bracket decorations. The signature Blacklight container for dashboards and data displays.
      </SectionDesc>

      <SubTitle>Preview</SubTitle>
      <PreviewBox>
        <Panel className="max-w-sm">
          <PanelHeader className="px-4 py-3">
            <PanelTitle>Network Status</PanelTitle>
          </PanelHeader>
          <PanelBody className="px-4 py-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between font-mono text-2xs">
                <span className="flex items-center gap-2 text-text-secondary">
                  <StatusDot status="success" />
                  EU-WEST-01
                </span>
                <span className="text-foreground">42ms</span>
              </div>
              <div className="flex items-center justify-between font-mono text-2xs">
                <span className="flex items-center gap-2 text-text-secondary">
                  <StatusDot status="success" />
                  US-EAST-01
                </span>
                <span className="text-foreground">18ms</span>
              </div>
              <div className="flex items-center justify-between font-mono text-2xs">
                <span className="flex items-center gap-2 text-text-secondary">
                  <StatusDot status="warn" />
                  AP-SOUTH-01
                </span>
                <span className="text-foreground">156ms</span>
              </div>
            </div>
          </PanelBody>
        </Panel>
      </PreviewBox>

      <CodeBlock label="USAGE">
        <span className="text-chart-2">{"<Panel>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<PanelHeader>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<PanelTitle>"}</span>Network Status
        <span className="text-chart-2">{"</PanelTitle>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</PanelHeader>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<PanelBody>"}</span>
        {"\n"}
        {"    "}
        <span className="text-text-tertiary">{"{ /* content */ }"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</PanelBody>"}</span>
        {"\n"}
        <span className="text-chart-2">{"</Panel>"}</span>
      </CodeBlock>

      <Paragraph>
        The Panel renders corner bracket marks (L-shaped borders) at all four corners automatically via the{" "}
        <Code>PanelCorners</Code> internal component. These adapt to the current theme.
      </Paragraph>

      <SubTitle>Sub-Components</SubTitle>
      <PropTable>
        <PropRow name="Panel" type="container" desc="Root with corner brackets, surface-base bg, border-dim border" />
        <PropRow name="PanelHeader" type="container" desc="Flex header with bottom border" />
        <PropRow name="PanelTitle" type="text" desc="Title with accent dot indicator, mono 2xs font, bold uppercase" />
        <PropRow name="PanelBody" type="container" desc="Content area with p-5 padding" />
      </PropTable>
    </>
  );
}

export default PanelSection;

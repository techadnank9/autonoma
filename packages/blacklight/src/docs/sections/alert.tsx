import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Code,
  CodeBlock,
  Paragraph,
  PropRow,
  PropTable,
  SectionDesc,
  SectionTitle,
  SubTitle,
} from "../components/atoms";

export function AlertSection() {
  return (
    <>
      <SectionTitle>Alert</SectionTitle>
      <SectionDesc>
        Callout component for informational messages, warnings, and critical notices. Features a left accent border with
        variant-driven colors that cascade to child components.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Alert</span>, <span className="text-chart-3">AlertTitle</span>,{" "}
        <span className="text-chart-3">AlertDescription</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Variants</SubTitle>
      <div className="my-4 flex flex-col gap-4">
        <Alert variant="info">
          <AlertTitle>Info</AlertTitle>
          <AlertDescription>Informational message using the primary accent color.</AlertDescription>
        </Alert>
        <Alert variant="warning">
          <AlertTitle>Warning</AlertTitle>
          <AlertDescription>Warning message with status-warn accent.</AlertDescription>
        </Alert>
        <Alert variant="critical">
          <AlertTitle>Critical</AlertTitle>
          <AlertDescription>Critical error with status-critical accent.</AlertDescription>
        </Alert>
        <Alert variant="success">
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Success confirmation with status-success accent.</AlertDescription>
        </Alert>
      </div>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow
          name="variant"
          type='"info" | "warning" | "critical" | "success"'
          def='"info"'
          desc="Visual style and accent color"
        />
      </PropTable>

      <Paragraph>
        The variant is set on the root <Code>Alert</Code> component and automatically cascades to{" "}
        <Code>AlertTitle</Code> via CSS group data attributes - no prop drilling needed.
      </Paragraph>
    </>
  );
}

export default AlertSection;

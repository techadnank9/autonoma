import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function ProgressSection() {
  return (
    <>
      <SectionTitle>Progress</SectionTitle>
      <SectionDesc>
        Progress bar with optional label and value display. Built on Base UI Progress primitive.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Progress, ProgressLabel, ProgressValue</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Basic</SubTitle>
      <PreviewBox>
        <div className="flex max-w-md flex-col gap-6">
          <Progress value={25} />
          <Progress value={60} />
          <Progress value={100} />
        </div>
      </PreviewBox>

      <SubTitle>With Label and Value</SubTitle>
      <PreviewBox>
        <div className="flex max-w-md flex-col gap-6">
          <Progress value={72}>
            <ProgressLabel>Test Execution</ProgressLabel>
            <ProgressValue />
          </Progress>
          <Progress value={45}>
            <ProgressLabel>Upload</ProgressLabel>
            <ProgressValue />
          </Progress>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="value" type="number" def="0" desc="Current progress (0-100)" />
      </PropTable>
    </>
  );
}

export default ProgressSection;

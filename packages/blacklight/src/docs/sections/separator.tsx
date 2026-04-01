import { Separator } from "@/components/ui/separator";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function SeparatorSection() {
  return (
    <>
      <SectionTitle>Separator</SectionTitle>
      <SectionDesc>Visual divider for separating content. Supports horizontal and vertical orientations.</SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Separator</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Horizontal</SubTitle>
      <PreviewBox>
        <div className="flex flex-col gap-3">
          <span className="font-mono text-2xs text-text-secondary">Section One</span>
          <Separator />
          <span className="font-mono text-2xs text-text-secondary">Section Two</span>
          <Separator />
          <span className="font-mono text-2xs text-text-secondary">Section Three</span>
        </div>
      </PreviewBox>

      <SubTitle>Vertical</SubTitle>
      <PreviewBox>
        <div className="flex h-8 items-center gap-3">
          <span className="font-mono text-2xs text-text-secondary">Left</span>
          <Separator orientation="vertical" />
          <span className="font-mono text-2xs text-text-secondary">Center</span>
          <Separator orientation="vertical" />
          <span className="font-mono text-2xs text-text-secondary">Right</span>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="orientation" type='"horizontal" | "vertical"' def='"horizontal"' desc="Divider direction" />
      </PropTable>
    </>
  );
}

export default SeparatorSection;

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function TextareaSection() {
  return (
    <>
      <SectionTitle>Textarea</SectionTitle>
      <SectionDesc>Multi-line text input field. Mono font styling with the same border treatment as Input.</SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Textarea</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Default</SubTitle>
      <PreviewBox>
        <div className="flex max-w-sm flex-col gap-2">
          <Label>Test Instructions</Label>
          <Textarea placeholder="Navigate to the login page and verify..." />
        </div>
      </PreviewBox>

      <SubTitle>States</SubTitle>
      <PreviewBox>
        <div className="flex max-w-sm flex-col gap-4">
          <Textarea placeholder="Default" />
          <Textarea disabled placeholder="Disabled" />
          <Textarea aria-invalid="true" defaultValue="invalid content" />
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="placeholder" type="string" def="-" desc="Placeholder text" />
        <PropRow name="disabled" type="boolean" def="false" desc="Disable interaction" />
        <PropRow name="aria-invalid" type="boolean" def="-" desc="Show invalid styling" />
        <PropRow name="rows" type="number" def="-" desc="Visible text lines" />
      </PropTable>
    </>
  );
}

export default TextareaSection;

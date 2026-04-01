import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function LabelSection() {
  return (
    <>
      <SectionTitle>Label</SectionTitle>
      <SectionDesc>Accessible label element for form controls. Mono font with uppercase tracking styling.</SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Label</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>With Input</SubTitle>
      <PreviewBox>
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="demo-input">Project Name</Label>
          <Input id="demo-input" placeholder="my-project" />
        </div>
      </PreviewBox>

      <SubTitle>With Checkbox</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-2">
          <Checkbox id="demo-checkbox" />
          <Label htmlFor="demo-checkbox">Accept terms</Label>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="htmlFor" type="string" def="-" desc="ID of the associated form control" />
      </PropTable>
    </>
  );
}

export default LabelSection;

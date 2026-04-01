import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function InputSection() {
  return (
    <>
      <SectionTitle>Input</SectionTitle>
      <SectionDesc>Single-line text input field. Built on Base UI Input primitive with mono font styling.</SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Input</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Default</SubTitle>
      <PreviewBox>
        <div className="flex max-w-sm flex-col gap-2">
          <Label>Email</Label>
          <Input type="email" placeholder="agent@autonoma.app" />
        </div>
      </PreviewBox>

      <SubTitle>States</SubTitle>
      <PreviewBox>
        <div className="flex max-w-sm flex-col gap-4">
          <Input placeholder="Default" />
          <Input disabled placeholder="Disabled" />
          <Input aria-invalid="true" defaultValue="invalid-value" />
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="type" type="string" def='"text"' desc="HTML input type" />
        <PropRow name="placeholder" type="string" def="-" desc="Placeholder text" />
        <PropRow name="disabled" type="boolean" def="false" desc="Disable interaction" />
        <PropRow name="aria-invalid" type="boolean" def="-" desc="Show invalid styling" />
      </PropTable>
    </>
  );
}

export default InputSection;

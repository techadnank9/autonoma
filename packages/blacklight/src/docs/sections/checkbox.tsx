import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function CheckboxSection() {
  return (
    <>
      <SectionTitle>Checkbox</SectionTitle>
      <SectionDesc>
        Toggle control for boolean selections. Built on Base UI Checkbox primitive with CVA size variants.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Checkbox</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Sizes</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox size="sm" defaultChecked />
            <Label>Small</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox size="default" defaultChecked />
            <Label>Default</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox size="lg" defaultChecked />
            <Label>Large</Label>
          </div>
        </div>
      </PreviewBox>

      <SubTitle>States</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Checkbox />
            <Label>Unchecked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox defaultChecked />
            <Label>Checked</Label>
          </div>
          <div className="flex items-center gap-2">
            <Checkbox disabled />
            <Label>Disabled</Label>
          </div>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="size" type='"sm" | "default" | "lg"' def='"default"' desc="Checkbox size" />
        <PropRow name="checked" type="boolean" def="-" desc="Controlled checked state" />
        <PropRow name="defaultChecked" type="boolean" def="false" desc="Initial checked state" />
        <PropRow name="disabled" type="boolean" def="false" desc="Disable interaction" />
        <PropRow name="onCheckedChange" type="(checked: boolean) => void" def="-" desc="Change handler" />
      </PropTable>
    </>
  );
}

export default CheckboxSection;

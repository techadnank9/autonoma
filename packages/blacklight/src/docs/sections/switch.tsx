import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function SwitchSection() {
  return (
    <>
      <SectionTitle>Switch</SectionTitle>
      <SectionDesc>Toggle switch for on/off states. Built on Base UI Switch primitive with size variants.</SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Switch</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Sizes</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch size="sm" defaultChecked />
            <Label>Small</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch size="default" defaultChecked />
            <Label>Default</Label>
          </div>
        </div>
      </PreviewBox>

      <SubTitle>States</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Switch />
            <Label>Off</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch defaultChecked />
            <Label>On</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch disabled />
            <Label>Disabled</Label>
          </div>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="size" type='"sm" | "default"' def='"default"' desc="Switch size" />
        <PropRow name="checked" type="boolean" def="-" desc="Controlled checked state" />
        <PropRow name="defaultChecked" type="boolean" def="false" desc="Initial checked state" />
        <PropRow name="disabled" type="boolean" def="false" desc="Disable interaction" />
        <PropRow name="onCheckedChange" type="(checked: boolean) => void" def="-" desc="Change handler" />
      </PropTable>
    </>
  );
}

export default SwitchSection;

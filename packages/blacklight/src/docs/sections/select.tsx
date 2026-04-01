import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function SelectSection() {
  return (
    <>
      <SectionTitle>Select</SectionTitle>
      <SectionDesc>
        Dropdown selection component. Built on Base UI Select primitive with positioner and grouped items.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Select, SelectTrigger, SelectValue, SelectContent, SelectItem</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Basic</SubTitle>
      <PreviewBox>
        <div className="flex max-w-sm flex-col gap-2">
          <Label>Platform</Label>
          <Select defaultValue="web">
            <SelectTrigger>
              <SelectValue placeholder="Select platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="web">Web</SelectItem>
              <SelectItem value="ios">iOS</SelectItem>
              <SelectItem value="android">Android</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </PreviewBox>

      <SubTitle>Grouped</SubTitle>
      <PreviewBox>
        <div className="max-w-sm">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select model" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectGroupLabel>Google</SelectGroupLabel>
                <SelectItem value="gemini-flash">Gemini Flash</SelectItem>
                <SelectItem value="gemini-pro">Gemini Pro</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectGroupLabel>OpenAI</SelectGroupLabel>
                <SelectItem value="gpt-4o">GPT-4o</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="value" type="string" def="-" desc="Controlled selected value" />
        <PropRow name="defaultValue" type="string" def="-" desc="Initial selected value" />
        <PropRow name="onValueChange" type="(value: string) => void" def="-" desc="Selection change handler" />
        <PropRow name="disabled" type="boolean" def="false" desc="Disable the select" />
      </PropTable>
    </>
  );
}

export default SelectSection;

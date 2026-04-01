import { Button } from "@/components/ui/button";
import { Play } from "@phosphor-icons/react/Play";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function ButtonSection() {
  return (
    <>
      <SectionTitle>Button</SectionTitle>
      <SectionDesc>
        Interactive button component with multiple variants and sizes. Built on Base UI primitives with CVA variant
        management.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Button</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Variants</SubTitle>
      <PreviewBox>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="default">Default</Button>
          <Button variant="accent">Accent</Button>
          <Button variant="cta">CTA</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </PreviewBox>

      <SubTitle>Sizes</SubTitle>
      <PreviewBox>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </PreviewBox>

      <SubTitle>Icon Buttons</SubTitle>
      <PreviewBox>
        <div className="flex items-center gap-3">
          <Button size="icon-xs" variant="outline">
            <Play />
          </Button>
          <Button size="icon-sm" variant="outline">
            <Play />
          </Button>
          <Button size="icon" variant="outline">
            <Play />
          </Button>
          <Button size="icon-lg" variant="outline">
            <Play />
          </Button>
        </div>
      </PreviewBox>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="variant" type="string" def='"default"' desc="Visual style variant" />
        <PropRow name="size" type="string" def='"default"' desc="Button size" />
        <PropRow name="disabled" type="boolean" def="false" desc="Disable interaction" />
        <PropRow name="asChild" type="boolean" def="false" desc="Render as child element" />
      </PropTable>
    </>
  );
}

export default ButtonSection;

import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CodeBlock, PreviewBox, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

const ITEMS = Array.from({ length: 20 }, (_, i) => `Test Case ${String(i + 1).padStart(3, "0")}`);

export function ScrollAreaSection() {
  return (
    <>
      <SectionTitle>Scroll Area</SectionTitle>
      <SectionDesc>
        Custom scrollbar container. Built on Base UI ScrollArea with styled vertical and horizontal scrollbars.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">ScrollArea</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Vertical Scroll</SubTitle>
      <PreviewBox>
        <ScrollArea className="h-48 w-64 border border-border-dim p-3">
          {ITEMS.map((item) => (
            <div key={item}>
              <div className="py-1.5 font-mono text-2xs text-text-secondary">{item}</div>
              <Separator />
            </div>
          ))}
        </ScrollArea>
      </PreviewBox>
    </>
  );
}

export default ScrollAreaSection;

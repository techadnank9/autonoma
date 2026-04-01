import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CodeBlock, PreviewBox, PropRow, PropTable, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function TooltipSection() {
  return (
    <>
      <SectionTitle>Tooltip</SectionTitle>
      <SectionDesc>
        Floating label that appears on hover. Built on Base UI Tooltip with positioner and portal.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Tooltip, TooltipTrigger, TooltipContent, TooltipProvider</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Basic</SubTitle>
      <PreviewBox>
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
              <TooltipContent>This is a tooltip</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </PreviewBox>

      <SubTitle>Positioning</SubTitle>
      <PreviewBox>
        <TooltipProvider>
          <div className="flex items-center gap-4">
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="sm">
                    Top
                  </Button>
                }
              />
              <TooltipContent side="top">Top tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="sm">
                    Bottom
                  </Button>
                }
              />
              <TooltipContent side="bottom">Bottom tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="sm">
                    Left
                  </Button>
                }
              />
              <TooltipContent side="left">Left tooltip</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger
                render={
                  <Button variant="ghost" size="sm">
                    Right
                  </Button>
                }
              />
              <TooltipContent side="right">Right tooltip</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </PreviewBox>

      <SubTitle>Props - TooltipContent</SubTitle>
      <PropTable>
        <PropRow name="side" type='"top" | "bottom" | "left" | "right"' def='"top"' desc="Tooltip placement" />
        <PropRow name="sideOffset" type="number" def="4" desc="Distance from trigger (px)" />
        <PropRow name="align" type='"start" | "center" | "end"' def='"center"' desc="Alignment along side" />
      </PropTable>
    </>
  );
}

export default TooltipSection;

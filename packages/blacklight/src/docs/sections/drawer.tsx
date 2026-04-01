import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerBackdrop,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  CodeBlock,
  Paragraph,
  PreviewBox,
  PropRow,
  PropTable,
  SectionDesc,
  SectionTitle,
  SubTitle,
} from "../components/atoms";

export function DrawerSection() {
  return (
    <>
      <SectionTitle>Drawer</SectionTitle>
      <SectionDesc>
        Sliding panel that enters from the edge of the screen. Supports bottom, left, and right positioning with swipe
        to dismiss.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Drawer</span>, <span className="text-chart-3">DrawerTrigger</span>,{" "}
        <span className="text-chart-3">DrawerContent</span>, <span className="text-chart-3">DrawerTitle</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Bottom Drawer</SubTitle>
      <PreviewBox>
        <Drawer side="bottom">
          <DrawerTrigger render={<Button variant="outline">Open Bottom Drawer</Button>} />
          <DrawerBackdrop />
          <DrawerContent side="bottom">
            <DrawerHeader>
              <DrawerTitle>Quick Actions</DrawerTitle>
              <DrawerDescription>Select an action to perform on the current test suite.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-2 py-4">
              <div className="border border-border-dim bg-surface-base p-3 font-mono text-2xs text-text-secondary">
                Run all tests in parallel mode
              </div>
              <div className="border border-border-dim bg-surface-base p-3 font-mono text-2xs text-text-secondary">
                Export results as CSV
              </div>
              <div className="border border-border-dim bg-surface-base p-3 font-mono text-2xs text-text-secondary">
                Generate coverage report
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose
                render={
                  <Button variant="ghost" size="sm">
                    Close
                  </Button>
                }
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </PreviewBox>

      <SubTitle>Right Drawer</SubTitle>
      <PreviewBox>
        <Drawer side="right">
          <DrawerTrigger render={<Button variant="outline">Open Right Drawer</Button>} />
          <DrawerBackdrop />
          <DrawerContent side="right">
            <DrawerHeader>
              <DrawerTitle>Details</DrawerTitle>
              <DrawerDescription>Node configuration and performance metrics.</DrawerDescription>
            </DrawerHeader>
            <div className="flex flex-col gap-3 py-4 font-mono text-2xs">
              <div className="flex justify-between">
                <span className="text-text-tertiary">Node ID</span>
                <span className="text-foreground">EU-WEST-01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Region</span>
                <span className="text-foreground">Frankfurt</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">CPU</span>
                <span className="text-foreground">42.5%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-tertiary">Memory</span>
                <span className="text-foreground">6.2 GB / 16 GB</span>
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose
                render={
                  <Button variant="ghost" size="sm">
                    Close
                  </Button>
                }
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </PreviewBox>

      <Paragraph>
        Set the side prop on both Drawer (controls swipe direction) and DrawerContent (controls positioning). The drawer
        automatically handles backdrop blur and slide animations.
      </Paragraph>

      <SubTitle>Props - Drawer</SubTitle>
      <PropTable>
        <PropRow
          name="side"
          type='"bottom" | "right" | "left"'
          def='"bottom"'
          desc="Which edge the drawer slides from"
        />
        <PropRow name="open" type="boolean" desc="Controlled open state" />
        <PropRow name="onOpenChange" type="function" desc="Callback when open state changes" />
        <PropRow name="modal" type="boolean" def="true" desc="Whether to trap focus and lock scroll" />
      </PropTable>

      <SubTitle>Props - DrawerContent</SubTitle>
      <PropTable>
        <PropRow
          name="side"
          type='"bottom" | "right" | "left"'
          def='"bottom"'
          desc="Positioning and animation direction"
        />
      </PropTable>
    </>
  );
}

export default DrawerSection;

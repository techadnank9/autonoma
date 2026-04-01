import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogBackdrop,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

export function DialogSection() {
  return (
    <>
      <SectionTitle>Dialog</SectionTitle>
      <SectionDesc>
        Modal overlay component for focused interactions. Built on Base UI Dialog with the signature Blacklight glow
        effect.
      </SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Dialog</span>, <span className="text-chart-3">DialogTrigger</span>,{" "}
        <span className="text-chart-3">DialogContent</span>, <span className="text-chart-3">DialogTitle</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Preview</SubTitle>
      <PreviewBox>
        <Dialog>
          <DialogTrigger render={<Button variant="outline">Open Dialog</Button>} />
          <DialogBackdrop />
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Action</DialogTitle>
              <DialogDescription>
                Are you sure you want to deploy the latest build to production? This action will affect all live users.
              </DialogDescription>
            </DialogHeader>
            <div className="px-6 py-4">
              <div className="border border-border-dim bg-surface-base p-3 font-mono text-4xs text-text-tertiary">
                BUILD: 2025.03.12-a4f2e1c
                {"\n"}
                BRANCH: main
                {"\n"}
                TESTS: 247/247 PASSED
              </div>
            </div>
            <DialogFooter>
              <DialogClose
                render={
                  <Button variant="ghost" size="sm">
                    Cancel
                  </Button>
                }
              />
              <DialogClose
                render={
                  <Button variant="accent" size="sm">
                    Deploy
                  </Button>
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PreviewBox>

      <SubTitle>Usage</SubTitle>
      <CodeBlock label="USAGE">
        <span className="text-chart-2">{"<Dialog>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<DialogTrigger>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<Button>"}</span>Open
        <span className="text-chart-2">{"</Button>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</DialogTrigger>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<DialogBackdrop />"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"<DialogContent>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DialogHeader>"}</span>
        {"\n"}
        {"      "}
        <span className="text-chart-2">{"<DialogTitle>"}</span>Title
        <span className="text-chart-2">{"</DialogTitle>"}</span>
        {"\n"}
        {"      "}
        <span className="text-chart-2">{"<DialogDescription>"}</span>Description
        <span className="text-chart-2">{"</DialogDescription>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"</DialogHeader>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"<DialogFooter>"}</span>
        {"\n"}
        {"      "}
        <span className="text-chart-2">{"<DialogClose>"}</span>
        <span className="text-chart-2">{"<Button>"}</span>Cancel
        <span className="text-chart-2">{"</Button>"}</span>
        <span className="text-chart-2">{"</DialogClose>"}</span>
        {"\n"}
        {"    "}
        <span className="text-chart-2">{"</DialogFooter>"}</span>
        {"\n"}
        {"  "}
        <span className="text-chart-2">{"</DialogContent>"}</span>
        {"\n"}
        <span className="text-chart-2">{"</Dialog>"}</span>
      </CodeBlock>

      <Paragraph>
        The DialogContent renders inside a Portal and centers itself on the viewport. The accent glow shadow adapts to
        each theme automatically.
      </Paragraph>

      <SubTitle>Props</SubTitle>
      <PropTable>
        <PropRow name="open" type="boolean" desc="Controlled open state" />
        <PropRow name="onOpenChange" type="function" desc="Callback when open state changes" />
        <PropRow name="modal" type="boolean" def="true" desc="Whether to trap focus and lock scroll" />
      </PropTable>
    </>
  );
}

export default DialogSection;

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardLabel,
  CardMeta,
  CardTitle,
  CardValue,
} from "@/components/ui/card";
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

export function CardSection() {
  return (
    <>
      <SectionTitle>Card</SectionTitle>
      <SectionDesc>Flexible container component with multiple layout sub-components and visual variants.</SectionDesc>

      <CodeBlock label="IMPORT">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">Card</span>, <span className="text-chart-3">CardHeader</span>,{" "}
        <span className="text-chart-3">CardTitle</span>, <span className="text-chart-3">CardContent</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
      </CodeBlock>

      <SubTitle>Default Card</SubTitle>
      <PreviewBox>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Network Status</CardTitle>
            <CardDescription>Real-time monitoring for all connected nodes.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="font-mono text-2xs text-text-secondary">
              All 12 nodes reporting nominal status. Average latency: 23ms.
            </p>
          </CardContent>
          <CardFooter>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </CardFooter>
        </Card>
      </PreviewBox>

      <SubTitle>Stat Card</SubTitle>
      <PreviewBox>
        <div className="grid max-w-md grid-cols-2 gap-4">
          <Card variant="stat">
            <CardHeader>
              <CardLabel>Total Tests</CardLabel>
              <CardValue>1,247</CardValue>
              <CardMeta>+12% from last week</CardMeta>
            </CardHeader>
          </Card>
          <Card variant="stat">
            <CardHeader>
              <CardLabel>Pass Rate</CardLabel>
              <CardValue>96.3%</CardValue>
              <CardMeta>Above 95% target</CardMeta>
            </CardHeader>
          </Card>
        </div>
      </PreviewBox>

      <SubTitle>Variants</SubTitle>
      <Paragraph>
        Four card variants: default (surface-base border), glass (translucent background), stat (for metric displays),
        and raised (elevated surface).
      </Paragraph>
      <PreviewBox>
        <div className="grid grid-cols-2 gap-4">
          <Card variant="default">
            <CardHeader>
              <CardTitle>Default</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-4xs text-text-tertiary">variant=&quot;default&quot;</p>
            </CardContent>
          </Card>
          <Card variant="glass">
            <CardHeader>
              <CardTitle>Glass</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-4xs text-text-tertiary">variant=&quot;glass&quot;</p>
            </CardContent>
          </Card>
          <Card variant="stat">
            <CardHeader>
              <CardTitle>Stat</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-4xs text-text-tertiary">variant=&quot;stat&quot;</p>
            </CardContent>
          </Card>
          <Card variant="raised">
            <CardHeader>
              <CardTitle>Raised</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-mono text-4xs text-text-tertiary">variant=&quot;raised&quot;</p>
            </CardContent>
          </Card>
        </div>
      </PreviewBox>

      <SubTitle>Sub-Components</SubTitle>
      <PropTable>
        <PropRow name="Card" type="container" desc="Root wrapper with variant styling" />
        <PropRow name="CardHeader" type="container" desc="Top section with flex layout" />
        <PropRow name="CardTitle" type="text" desc="Title text with mono font" />
        <PropRow name="CardDescription" type="text" desc="Muted description text" />
        <PropRow name="CardContent" type="container" desc="Main body content" />
        <PropRow name="CardFooter" type="container" desc="Bottom section" />
        <PropRow name="CardLabel" type="text" desc="Stat card label (4xs mono)" />
        <PropRow name="CardValue" type="text" desc="Stat card large value" />
        <PropRow name="CardMeta" type="text" desc="Stat card metadata" />
      </PropTable>
    </>
  );
}

export default CardSection;

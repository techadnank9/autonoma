import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock, Paragraph, SectionDesc, SectionTitle, StepNumber } from "../components/atoms";

export function InstallationSection() {
  return (
    <>
      <SectionTitle>Installation</SectionTitle>
      <SectionDesc>
        Set up Blacklight in your project. Install the package, import styles, wrap with the theme provider, and start
        using components.
      </SectionDesc>

      <Tabs defaultValue="react" className="mb-8">
        <TabsList variant="line" className="border-b border-border-dim pb-0">
          <TabsTrigger value="react">React</TabsTrigger>
          <TabsTrigger value="nextjs">Next.js</TabsTrigger>
        </TabsList>

        <TabsContent value="react">
          <div className="mt-8 flex flex-col gap-10">
            <div className="flex gap-5">
              <StepNumber n={1} />
              <div className="flex-1">
                <h3 className="mb-3 font-mono text-base font-bold">Install Package</h3>
                <Paragraph>Add Blacklight to your project via your preferred package manager.</Paragraph>
                <CodeBlock label="TERMINAL">
                  <span className="text-text-tertiary">$ </span>npm install @autonoma/blacklight
                </CodeBlock>
                <Alert variant="info" className="mt-4">
                  <AlertTitle>Info</AlertTitle>
                  <AlertDescription>
                    Blacklight requires React 18+ and Tailwind CSS v4. Ensure your project meets these prerequisites.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="flex gap-5">
              <StepNumber n={2} />
              <div className="flex-1">
                <h3 className="mb-3 font-mono text-base font-bold">Import Styles</h3>
                <Paragraph>
                  Import the Blacklight stylesheet in your application entry point. This registers all theme tokens,
                  surface tiers, and component styles.
                </Paragraph>
                <CodeBlock label="ENTRY.TSX">
                  <span className="text-status-critical">import</span>{" "}
                  <span className="text-text-secondary">&quot;@autonoma/blacklight/styles.css&quot;</span>
                  {";"}
                </CodeBlock>
              </div>
            </div>

            <div className="flex gap-5">
              <StepNumber n={3} />
              <div className="flex-1">
                <h3 className="mb-3 font-mono text-base font-bold">Configure Theme Provider</h3>
                <Paragraph>
                  Wrap your application root with the ThemeProvider. This enables theme switching between light, dark,
                  and system modes.
                </Paragraph>
                <CodeBlock label="APP.TSX">
                  <span className="text-status-critical">import</span> {"{ "}
                  <span className="text-chart-3">ThemeProvider</span>
                  {" }"} <span className="text-status-critical">from</span>{" "}
                  <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
                  {";"}
                  {"\n\n"}
                  <span className="text-status-critical">function</span> <span className="text-chart-3">App</span>
                  {"() {\n"}
                  {"  "}
                  <span className="text-status-critical">return</span> ({"\n"}
                  {"    "}
                  <span className="text-chart-2">{"<ThemeProvider>"}</span>
                  {"\n"}
                  {"      "}
                  <span className="text-chart-2">{"<YourApp />"}</span>
                  {"\n"}
                  {"    "}
                  <span className="text-chart-2">{"</ThemeProvider>"}</span>
                  {"\n"}
                  {"  );\n"}
                  {"}"}
                </CodeBlock>
                <Alert variant="warning" className="mt-4">
                  <AlertTitle>Important</AlertTitle>
                  <AlertDescription>
                    ThemeProvider must be at the root of your component tree. It applies theme classes to the document
                    and persists selection via localStorage.
                  </AlertDescription>
                </Alert>
              </div>
            </div>

            <div className="flex gap-5">
              <StepNumber n={4} />
              <div className="flex-1">
                <h3 className="mb-3 font-mono text-base font-bold">Use Components</h3>
                <Paragraph>
                  Import and use Blacklight components. All components are theme-aware and adapt automatically.
                </Paragraph>
                <CodeBlock label="EXAMPLE.TSX">
                  <span className="text-status-critical">import</span> {"{ "}
                  <span className="text-chart-3">Button</span>, <span className="text-chart-3">Badge</span>,{" "}
                  <span className="text-chart-3">Panel</span>
                  {" }"} <span className="text-status-critical">from</span>{" "}
                  <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
                  {";"}
                </CodeBlock>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="nextjs">
          <div className="mt-8 flex flex-col gap-10">
            <div className="flex gap-5">
              <StepNumber n={1} />
              <div className="flex-1">
                <h3 className="mb-3 font-mono text-base font-bold">Install Package</h3>
                <CodeBlock label="TERMINAL">
                  <span className="text-text-tertiary">$ </span>npx create-next-app@latest --tailwind{"\n"}
                  <span className="text-text-tertiary">$ </span>npm install @autonoma/blacklight
                </CodeBlock>
              </div>
            </div>
            <div className="flex gap-5">
              <StepNumber n={2} />
              <div className="flex-1">
                <h3 className="mb-3 font-mono text-base font-bold">Import in Layout</h3>
                <Paragraph>
                  Import styles in your root layout. Use the ThemeProvider with the &quot;use client&quot; directive.
                </Paragraph>
                <CodeBlock label="LAYOUT.TSX">
                  <span className="text-text-tertiary">&quot;use client&quot;</span>
                  {";"}
                  {"\n"}
                  <span className="text-status-critical">import</span>{" "}
                  <span className="text-text-secondary">&quot;@autonoma/blacklight/styles.css&quot;</span>
                  {";"}
                  {"\n"}
                  <span className="text-status-critical">import</span> {"{ "}
                  <span className="text-chart-3">ThemeProvider</span>
                  {" }"} <span className="text-status-critical">from</span>{" "}
                  <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
                  {";"}
                </CodeBlock>
                <Alert variant="info" className="mt-4">
                  <AlertTitle>Note</AlertTitle>
                  <AlertDescription>
                    Next.js App Router requires &quot;use client&quot; for the ThemeProvider wrapper since it uses React
                    context and localStorage.
                  </AlertDescription>
                </Alert>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}

export default InstallationSection;

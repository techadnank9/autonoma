import { Code, CodeBlock, Paragraph, SectionDesc, SectionTitle, SubTitle, TokenGroup } from "../components/atoms";

export function ThemingSection() {
  return (
    <>
      <SectionTitle>Theming</SectionTitle>
      <SectionDesc>
        Blacklight uses CSS custom properties for all design decisions. Override tokens to create custom themes or
        adjust existing ones.
      </SectionDesc>

      <SubTitle>Using the Theme Hook</SubTitle>
      <Paragraph>
        Access the current theme and setter via the <Code>useTheme</Code> hook. This returns the active theme name and a
        function to change it.
      </Paragraph>
      <CodeBlock label="USAGE.TSX">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">useTheme</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;@autonoma/blacklight&quot;</span>
        {";"}
        {"\n\n"}
        <span className="text-status-critical">const</span> {"{ theme, setTheme } = "}
        <span className="text-chart-3">useTheme</span>()
        {"\n\n"}
        <span className="text-text-tertiary">{"// theme: 'blacklight' | 'blacklight-dark'"}</span>
        {"\n"}
        <span className="text-chart-3">setTheme</span>(
        <span className="text-text-secondary">&quot;blacklight-dark&quot;</span>)
      </CodeBlock>

      <SubTitle>Overriding Tokens</SubTitle>
      <Paragraph>
        Create a custom theme by defining a CSS class with your token overrides. Apply it alongside or instead of the
        built-in themes.
      </Paragraph>
      <CodeBlock label="CUSTOM-THEME.CSS">
        <span className="text-chart-2">.my-theme</span> {"{"}
        {"\n"}
        {"  --background: #1a1a2e;\n"}
        {"  --primary: #e94560;\n"}
        {"  --surface-base: #16213e;\n"}
        {"  --surface-raised: #0f3460;\n"}
        {"  --text-primary-ink: #ffffff;\n"}
        {"  --text-secondary: rgba(255, 255, 255, 0.7);\n"}
        {"}"}
      </CodeBlock>

      <SubTitle>Token Categories</SubTitle>
      <div className="my-4 grid grid-cols-2 gap-4">
        <TokenGroup
          title="Surfaces"
          tokens={[
            { name: "--surface-void", desc: "Page background" },
            { name: "--surface-base", desc: "Card / panel fill" },
            { name: "--surface-raised", desc: "Elevated elements" },
          ]}
        />
        <TokenGroup
          title="Text Tiers"
          tokens={[
            { name: "--text-primary-ink", desc: "Headings, body" },
            { name: "--text-secondary", desc: "Descriptions" },
            { name: "--text-tertiary", desc: "Captions, muted" },
          ]}
        />
        <TokenGroup
          title="Borders"
          tokens={[
            { name: "--border-dim", desc: "Subtle separators" },
            { name: "--border-mid", desc: "Default borders" },
            { name: "--border-highlight", desc: "Focus / active" },
          ]}
        />
        <TokenGroup
          title="Status"
          tokens={[
            { name: "--status-critical", desc: "Errors" },
            { name: "--status-high", desc: "High severity" },
            { name: "--status-warn", desc: "Warnings" },
            { name: "--status-success", desc: "Confirmation" },
          ]}
        />
      </div>
    </>
  );
}

export default ThemingSection;

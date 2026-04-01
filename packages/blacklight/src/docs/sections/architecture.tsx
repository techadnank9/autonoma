import { CodeBlock, Paragraph, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function ArchitectureSection() {
  return (
    <>
      <SectionTitle>Architecture</SectionTitle>
      <SectionDesc>
        How Blacklight is structured internally. Understanding the architecture helps you extend and customize the
        system.
      </SectionDesc>

      <SubTitle>Package Structure</SubTitle>
      <CodeBlock label="DIRECTORY">
        {`blacklight/
├── src/
│   ├── components/ui/     # 17 UI components (CVA + Base UI)
│   ├── lib/utils.ts       # cn() utility (clsx + tailwind-merge)
│   ├── index.css           # Theme tokens + Tailwind config
│   └── components/
│       ├── theme-provider  # Theme context + D-key toggle
│       └── logo            # Animated logo component`}
      </CodeBlock>

      <SubTitle>Component Pattern</SubTitle>
      <Paragraph>
        Every component follows the same pattern: CVA for variant definitions, Base UI primitives for accessibility, CSS
        custom properties for theming. No business logic in any component.
      </Paragraph>
      <CodeBlock label="PATTERN.TSX">
        <span className="text-status-critical">import</span> {"{ "}
        <span className="text-chart-3">cva</span>
        {" }"} <span className="text-status-critical">from</span>{" "}
        <span className="text-text-secondary">&quot;class-variance-authority&quot;</span>
        {";"}
        {"\n\n"}
        <span className="text-text-tertiary">{"// 1. Define variants with CVA"}</span>
        {"\n"}
        <span className="text-status-critical">const</span> variants = <span className="text-chart-3">cva</span>
        {"(base, { variants })"}
        {"\n\n"}
        <span className="text-text-tertiary">{"// 2. Compose with cn() for className merging"}</span>
        {"\n"}
        {"className={cn(variants({ variant }), className)}"}
        {"\n\n"}
        <span className="text-text-tertiary">{"// 3. Theme tokens via CSS custom properties"}</span>
        {"\n"}
        <span className="text-text-tertiary">{"// bg-surface-base → var(--surface-base)"}</span>
      </CodeBlock>

      <SubTitle>Theme System</SubTitle>
      <Paragraph>
        Themes are CSS class names applied to the root element. Each theme defines 42+ CSS custom properties. The
        ThemeProvider manages class toggling and localStorage persistence.
      </Paragraph>
      <div className="my-4 grid grid-cols-2 gap-3">
        {[
          {
            theme: "blacklight-dark",
            accent: "Lime (#C2E812)",
            bg: "Void (#050505)",
          },
          {
            theme: "blacklight",
            accent: "Lime (#C2E812)",
            bg: "Lavender (#EFE9F4)",
          },
        ].map((t) => (
          <div key={t.theme} className="border border-border-dim bg-surface-base p-3">
            <div className="mb-1 font-mono text-3xs font-bold uppercase tracking-wider text-primary-ink">
              .{t.theme}
            </div>
            <div className="font-mono text-4xs text-text-tertiary">
              Accent: {t.accent}
              <br />
              Background: {t.bg}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default ArchitectureSection;

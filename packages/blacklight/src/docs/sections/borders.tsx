import { cn } from "@/lib/utils";
import { CodeBlock, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function BordersSection() {
  return (
    <>
      <SectionTitle>Borders</SectionTitle>
      <SectionDesc>
        Three-tier border system for visual hierarchy. From subtle separators to focused highlights.
      </SectionDesc>

      <div className="my-6 flex flex-col gap-4">
        {[
          {
            name: "Dim",
            token: "--border-dim",
            desc: "Subtle separators, table lines, inactive containers",
            cls: "border-border-dim",
          },
          {
            name: "Mid",
            token: "--border-mid",
            desc: "Default borders, input outlines, card edges",
            cls: "border-border-mid",
          },
          {
            name: "Highlight",
            token: "--border-highlight",
            desc: "Active focus, selected states, emphasis",
            cls: "border-border-highlight",
          },
        ].map((b) => (
          <div key={b.name} className="flex items-center gap-4">
            <div className={cn("h-12 w-32 shrink-0 border-2 bg-surface-base", b.cls)} />
            <div>
              <div className="font-mono text-3xs font-bold uppercase tracking-wider text-primary-ink">{b.name}</div>
              <code className="font-mono text-4xs text-text-tertiary">{b.token}</code>
              <div className="mt-1 font-mono text-4xs text-text-secondary">{b.desc}</div>
            </div>
          </div>
        ))}
      </div>

      <SubTitle>Usage with Tailwind</SubTitle>
      <CodeBlock label="CLASSES">
        <span className="text-text-tertiary">{"/* Blacklight border utility classes */"}</span>
        {"\n"}
        border-border-dim {"   "}
        <span className="text-text-tertiary">{"/* subtle */"}</span>
        {"\n"}
        border-border-mid {"   "}
        <span className="text-text-tertiary">{"/* default */"}</span>
        {"\n"}
        border-border-highlight <span className="text-text-tertiary">{"/* emphasis */"}</span>
      </CodeBlock>
    </>
  );
}

export default BordersSection;

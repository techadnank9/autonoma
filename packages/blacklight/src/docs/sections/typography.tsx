import { cn } from "@/lib/utils";
import { Paragraph, SectionDesc, SectionTitle, SubTitle } from "../components/atoms";

export function TypographySection() {
  return (
    <>
      <SectionTitle>Typography</SectionTitle>
      <SectionDesc>
        Blacklight uses a dual-font system: DM Sans for readable body text and Geist Mono for data, labels, and code.
      </SectionDesc>

      <SubTitle>Font Stack</SubTitle>
      <div className="my-4 grid grid-cols-2 gap-4">
        <div className="border border-border-dim bg-surface-base p-5">
          <div className="mb-2 font-mono text-3xs font-bold uppercase tracking-wider text-primary-ink">--font-sans</div>
          <div className="text-lg font-medium text-foreground">DM Sans Variable</div>
          <div className="mt-1 font-mono text-4xs text-text-tertiary">Body text, descriptions, headings</div>
        </div>
        <div className="border border-border-dim bg-surface-base p-5">
          <div className="mb-2 font-mono text-3xs font-bold uppercase tracking-wider text-primary-ink">--font-mono</div>
          <div className="font-mono text-lg font-medium text-foreground">Geist Mono Variable</div>
          <div className="mt-1 font-mono text-4xs text-text-tertiary">Data, labels, code, status text</div>
        </div>
      </div>

      <SubTitle>Custom Size Scale</SubTitle>
      <Paragraph>Blacklight extends Tailwind with three extra-small sizes for high-density data displays.</Paragraph>
      <div className="my-4 border border-border-dim bg-surface-base p-4">
        {[
          {
            cls: "text-4xs",
            size: "9px",
            sample: "SYSTEM_STATUS: OPERATIONAL",
          },
          {
            cls: "text-3xs",
            size: "10px",
            sample: "SYSTEM_STATUS: OPERATIONAL",
          },
          {
            cls: "text-2xs",
            size: "11px",
            sample: "SYSTEM_STATUS: OPERATIONAL",
          },
          {
            cls: "text-xs",
            size: "12px",
            sample: "SYSTEM_STATUS: OPERATIONAL",
          },
          {
            cls: "text-sm",
            size: "14px",
            sample: "System Status: Operational",
          },
          {
            cls: "text-base",
            size: "16px",
            sample: "System Status: Operational",
          },
        ].map((t) => (
          <div key={t.cls} className="mb-3 flex items-baseline gap-4">
            <code className="w-20 shrink-0 font-mono text-4xs text-primary-ink">{t.cls}</code>
            <span className="w-12 shrink-0 font-mono text-4xs text-text-tertiary">{t.size}</span>
            <span className={cn("font-mono text-foreground", t.cls)}>{t.sample}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export default TypographySection;

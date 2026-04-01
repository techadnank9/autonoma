import { cn } from "@/lib/utils";
import type * as React from "react";

export function SysHeader() {
  return (
    <header className="flex items-end justify-between border-b border-border-dim pb-5 font-mono text-3xs uppercase tracking-widest text-text-tertiary">
      <div>
        <div className="mb-1 text-text-tertiary">DOC_REF: BLACKLIGHT_V2.1</div>
        <div className="text-sm font-bold tracking-[0.15em] text-foreground">BLACKLIGHT_OS / DOCUMENTATION</div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span>STATUS: PUBLISHED</span>
        <span className="text-primary-ink">DESIGN_SYSTEM_V1</span>
      </div>
    </header>
  );
}

export function NavItem({
  active,
  children,
  onClick,
}: { active?: boolean; children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      type="button"
      className={cn(
        "flex cursor-pointer items-center gap-2 font-mono text-2xs text-text-secondary transition-colors hover:text-foreground",
        active === true && "text-primary-ink",
      )}
      onClick={onClick}
    >
      {active === true && <span className="inline-block size-1 bg-primary" />}
      {children}
    </button>
  );
}

export function StepNumber({ n }: { n: number }) {
  return (
    <div className="flex size-7 shrink-0 items-center justify-center border border-border-mid bg-surface-base font-mono text-2xs font-extrabold text-primary-ink">
      {String(n).padStart(2, "0")}
    </div>
  );
}

export function CodeBlock({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div className="relative my-4 border border-border-dim bg-surface-base p-4">
      {label != null && (
        <div className="absolute -top-2.5 right-3 bg-background px-2 font-mono text-4xs text-text-tertiary">
          {label}
        </div>
      )}
      <pre className="overflow-x-auto font-mono text-2xs leading-relaxed text-primary-ink">{children}</pre>
    </div>
  );
}

export function Code({ children }: { children: React.ReactNode }) {
  return <code className="bg-surface-base px-1.5 py-0.5 font-mono text-2xs text-primary-ink">{children}</code>;
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="mb-3 font-mono text-[28px] font-extrabold uppercase leading-none tracking-tight">{children}</h1>
  );
}

export function SectionDesc({ children }: { children: React.ReactNode }) {
  return <p className="mb-8 font-mono text-2xs leading-relaxed text-text-secondary">{children}</p>;
}

export function SubTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="mb-4 mt-10 border-t border-border-dim pt-6 font-mono text-base font-extrabold uppercase tracking-tight">
      {children}
    </h2>
  );
}

export function Paragraph({ children }: { children: React.ReactNode }) {
  return <p className="mb-4 font-mono text-2xs leading-relaxed text-text-secondary">{children}</p>;
}

export function TokenGroup({
  title,
  tokens,
}: {
  title: string;
  tokens: { name: string; desc: string; swatch?: string }[];
}) {
  return (
    <div className="border border-border-dim bg-surface-base p-4">
      <div className="mb-3 font-mono text-3xs font-bold uppercase tracking-wider text-foreground">{title}</div>
      {tokens.map((t) => (
        <div key={t.name} className="mb-2 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {t.swatch != null && (
              <span className="inline-block size-3 border border-border-dim" style={{ backgroundColor: t.swatch }} />
            )}
            <code className="font-mono text-4xs text-primary-ink">{t.name}</code>
          </div>
          <span className="font-mono text-4xs text-text-tertiary">{t.desc}</span>
        </div>
      ))}
    </div>
  );
}

export function PropRow({ name, type, def, desc }: { name: string; type: string; def?: string; desc: string }) {
  return (
    <div className="flex items-baseline gap-4 border-b border-border-dim py-2.5 font-mono text-2xs">
      <span className="w-28 shrink-0 font-bold text-foreground">{name}</span>
      <span className="w-32 shrink-0 text-chart-3">{type}</span>
      <span className="w-20 shrink-0 text-text-tertiary">{def ?? "-"}</span>
      <span className="text-text-secondary">{desc}</span>
    </div>
  );
}

export function PropTable({ children }: { children: React.ReactNode }) {
  return (
    <div className="my-4">
      <div className="flex items-baseline gap-4 border-b border-border-mid py-2 font-mono text-4xs font-bold uppercase tracking-wider text-text-tertiary">
        <span className="w-28 shrink-0">Prop</span>
        <span className="w-32 shrink-0">Type</span>
        <span className="w-20 shrink-0">Default</span>
        <span>Description</span>
      </div>
      {children}
    </div>
  );
}

export function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="font-mono text-2xs text-text-tertiary">{label}</span>
      <span className="font-mono text-2xs font-bold text-foreground">{value}</span>
    </div>
  );
}

export function PreviewBox({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("my-4 border border-border-dim bg-surface-void p-6", className)}>{children}</div>;
}

export function ChecklistItem({ done, children }: { done?: boolean; children: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center gap-2.5 font-mono text-2xs text-text-secondary">
      {done === true ? (
        <div className="flex size-3.5 items-center justify-center bg-primary">
          <span className="text-4xs font-extrabold text-primary-foreground">✓</span>
        </div>
      ) : (
        <div className="size-3.5 border border-border-mid" />
      )}
      {children}
    </div>
  );
}

import { useState } from "react";

import { StatusDot } from "@/components/ui/status-dot";

import { NavItem, StatRow, SysHeader } from "./docs/components/atoms";
import { NAV_SECTIONS, type PageId } from "./docs/nav";
import { PAGE_COMPONENTS } from "./docs/sections";

export default function DocsPage() {
  const [activePage, setActivePage] = useState<PageId>("introduction");
  const ActiveContent = PAGE_COMPONENTS[activePage];

  return (
    <div className="flex h-screen w-screen flex-col gap-8 overflow-hidden bg-background p-10">
      <SysHeader />

      <main className="grid min-h-0 flex-1 grid-cols-[200px_1fr_220px] gap-10">
        {/* ── Left nav ── */}
        <nav className="flex flex-col gap-6 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="flex flex-col gap-3">
              <div className="font-mono text-4xs font-bold uppercase tracking-widest text-text-tertiary">
                {section.label}
              </div>
              {section.items.map((item) => (
                <NavItem key={item.id} active={activePage === item.id} onClick={() => setActivePage(item.id)}>
                  {item.label}
                </NavItem>
              ))}
            </div>
          ))}
        </nav>

        {/* ── Main content ── */}
        <section className="overflow-y-auto pr-5">
          <ActiveContent />
        </section>

        {/* ── Right sidebar ── */}
        <aside className="flex flex-col gap-4 overflow-y-auto">
          <div className="border border-border-dim bg-surface-base p-4">
            <div className="mb-3 font-mono text-4xs font-bold uppercase tracking-widest text-text-tertiary">
              Package Stats
            </div>
            <div className="flex flex-col gap-2">
              <StatRow label="Components" value="17" />
              <StatRow label="Theme Variants" value="2" />
              <StatRow label="Design Tokens" value="42" />
              <StatRow label="Icon Set" value="Phosphor" />
            </div>
          </div>

          <div className="border border-border-dim bg-surface-base p-4">
            <div className="mb-3 font-mono text-4xs font-bold uppercase tracking-widest text-text-tertiary">
              Quick Links
            </div>
            <div className="flex flex-col gap-2">
              <a href="/presentation" className="font-mono text-2xs text-primary-ink hover:underline">
                → Presentation Deck
              </a>
              <a href="/telemetry" className="font-mono text-2xs text-primary-ink hover:underline">
                → Telemetry Dashboard
              </a>
              <a href="/" className="font-mono text-2xs text-primary-ink hover:underline">
                → Component Showcase
              </a>
              <a href="/logo" className="font-mono text-2xs text-primary-ink hover:underline">
                → Logo Variants
              </a>
            </div>
          </div>
        </aside>
      </main>

      <footer className="flex items-center justify-between border-t border-border-dim pt-5 font-mono text-4xs uppercase tracking-widest text-text-tertiary">
        <span>BUILD: 2025.03.12</span>
        <span className="flex items-center gap-2">
          <StatusDot status="success" />
          ALL SYSTEMS OPERATIONAL
        </span>
        <span>16 SECTIONS / {NAV_SECTIONS.reduce((acc, s) => acc + s.items.length, 0)} PAGES</span>
      </footer>
    </div>
  );
}

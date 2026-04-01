import { SectionDesc, SectionTitle, SubTitle, TokenGroup } from "../components/atoms";

export function ColorsSection() {
  return (
    <>
      <SectionTitle>Colors</SectionTitle>
      <SectionDesc>
        Complete color token reference for all four theme variants. Every color in Blacklight is a CSS custom property -
        no hardcoded hex values in components.
      </SectionDesc>

      <SubTitle>Primary & Accent</SubTitle>
      <div className="my-4 grid grid-cols-2 gap-4">
        <TokenGroup
          title="Primary"
          tokens={[
            { name: "--primary", desc: "Brand accent color" },
            { name: "--primary-foreground", desc: "Text on primary" },
            {
              name: "--primary-contrast",
              desc: "Darker alt for low contrast",
            },
          ]}
        />
        <TokenGroup
          title="Accent Effects"
          tokens={[
            { name: "--accent-glow", desc: "Translucent glow (40%)" },
            { name: "--accent-dim", desc: "Subtle tint (5-10%)" },
            { name: "--violet-accent", desc: "Violet for contrast" },
          ]}
        />
      </div>

      <SubTitle>Status Colors</SubTitle>
      <div className="my-4">
        <TokenGroup
          title="Semantic Status"
          tokens={[
            {
              name: "--status-critical",
              desc: "Errors, destructive actions",
            },
            { name: "--status-high", desc: "High severity warnings" },
            { name: "--status-warn", desc: "Caution, pending states" },
            {
              name: "--status-success",
              desc: "Confirmation, live states",
            },
          ]}
        />
      </div>

      <SubTitle>Chart Palette</SubTitle>
      <div className="my-4">
        <TokenGroup
          title="Data Visualization"
          tokens={[
            { name: "--chart-1", desc: "Primary data series" },
            { name: "--chart-2", desc: "Secondary series" },
            { name: "--chart-3", desc: "Tertiary series" },
            { name: "--chart-4", desc: "Quaternary series" },
            { name: "--chart-5", desc: "Quinary series" },
          ]}
        />
      </div>
    </>
  );
}

export default ColorsSection;

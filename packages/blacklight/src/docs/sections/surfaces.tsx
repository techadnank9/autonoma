import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { SectionDesc, SectionTitle } from "../components/atoms";

export function SurfacesSection() {
  return (
    <>
      <SectionTitle>Surfaces</SectionTitle>
      <SectionDesc>
        Three-tier surface system replaces traditional shadows. Each tier has a distinct background color that creates
        visual hierarchy through layering.
      </SectionDesc>

      <div className="my-6 flex gap-4">
        {[
          {
            name: "Void",
            token: "--surface-void",
            desc: "Page background. The base layer.",
            cls: "bg-background",
          },
          {
            name: "Base",
            token: "--surface-base",
            desc: "Cards, panels, containers. Primary content layer.",
            cls: "bg-surface-base",
          },
          {
            name: "Raised",
            token: "--surface-raised",
            desc: "Elevated elements. Dropdowns, tooltips, modals.",
            cls: "bg-surface-raised",
          },
        ].map((s) => (
          <div key={s.name} className="flex-1 border border-border-dim p-5">
            <div className={cn("mb-3 h-16 border border-border-dim", s.cls)} />
            <div className="mb-1 font-mono text-3xs font-bold uppercase tracking-wider text-primary-ink">{s.name}</div>
            <code className="font-mono text-4xs text-text-tertiary">{s.token}</code>
            <div className="mt-2 font-mono text-4xs text-text-secondary">{s.desc}</div>
          </div>
        ))}
      </div>

      <Alert variant="info" className="mt-4">
        <AlertTitle>Principle</AlertTitle>
        <AlertDescription>
          Never use box-shadow for elevation. Blacklight uses surface color tiers to create depth. Each layer is a
          distinct, flat color - no gradients, no blur.
        </AlertDescription>
      </Alert>
    </>
  );
}

export default SurfacesSection;

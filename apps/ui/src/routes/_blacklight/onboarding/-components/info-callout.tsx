import { InfoIcon } from "@phosphor-icons/react/Info";
import type { ReactNode } from "react";

interface InfoCalloutProps {
  title?: string;
  children: ReactNode;
}

export function InfoCallout({ title, children }: InfoCalloutProps) {
  return (
    <div className="flex items-start gap-3 border border-primary-ink/20 bg-primary-ink/5 p-4">
      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center">
        <InfoIcon size={18} weight="fill" className="text-primary-ink" />
      </div>
      <p className="text-sm leading-relaxed text-text-secondary">
        {title != null && <span className="font-medium text-text-primary">{title}: </span>}
        {children}
      </p>
    </div>
  );
}

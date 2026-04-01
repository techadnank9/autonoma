import { Input as InputPrimitive } from "@base-ui/react/input";
import type * as React from "react";

import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-none border border-border-mid bg-surface-void px-2.5 py-1 font-mono text-xs text-foreground transition-colors outline-none placeholder:text-text-tertiary focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-status-critical aria-invalid:ring-1 aria-invalid:ring-status-critical/20",
        className,
      )}
      {...props}
    />
  );
}

export { Input };

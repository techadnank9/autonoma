import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

const statusDotVariants = cva("inline-block size-1.5 shrink-0", {
  variants: {
    status: {
      success: "bg-status-success",
      warn: "bg-status-warn",
      critical: "bg-status-critical",
      neutral: "bg-text-tertiary",
    },
  },
  defaultVariants: {
    status: "neutral",
  },
});

function StatusDot({
  className,
  status = "neutral",
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusDotVariants>) {
  return (
    <span
      data-slot="status-dot"
      data-status={status}
      className={cn(statusDotVariants({ status }), className)}
      {...props}
    />
  );
}

export { StatusDot, statusDotVariants };

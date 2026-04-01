import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

/* ═══════════════════════════════════════════
   Alert
   Usage:
     <Alert variant="info">
       <AlertTitle>Info</AlertTitle>
       <AlertDescription>Something happened.</AlertDescription>
     </Alert>
   ═══════════════════════════════════════════ */

const alertVariants = cva("group/alert relative border-l-[3px] p-4 font-mono text-2xs", {
  variants: {
    variant: {
      info: "border-primary bg-accent-dim",
      warning: "border-status-warn bg-status-warn/5",
      critical: "border-status-critical bg-status-critical/5",
      success: "border-status-success bg-status-success/5",
    },
  },
  defaultVariants: {
    variant: "info",
  },
});

function Alert({
  className,
  variant = "info",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div data-slot="alert" data-variant={variant} className={cn(alertVariants({ variant }), className)} {...props} />
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "mb-1 flex items-center gap-2 text-4xs font-extrabold uppercase tracking-wider",
        /* Variant colors inherited from parent Alert via group data attribute */
        "group-data-[variant=info]/alert:text-primary-ink",
        "group-data-[variant=warning]/alert:text-status-warn",
        "group-data-[variant=critical]/alert:text-status-critical",
        "group-data-[variant=success]/alert:text-status-success",
        className,
      )}
      {...props}
    >
      {/* Accent dot */}
      <span
        className={cn(
          "inline-block size-1",
          "group-data-[variant=info]/alert:bg-primary",
          "group-data-[variant=warning]/alert:bg-status-warn",
          "group-data-[variant=critical]/alert:bg-status-critical",
          "group-data-[variant=success]/alert:bg-status-success",
        )}
      />
      {props.children}
    </div>
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="alert-description" className={cn("text-text-secondary", className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription, alertVariants };

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { Check } from "@phosphor-icons/react/Check";
import { type VariantProps, cva } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../../lib/utils";

const checkboxVariants = cva(
  "peer shrink-0 border transition-colors outline-none focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 data-[checked]:border-primary-ink data-[checked]:bg-primary-ink data-[checked]:text-surface-void",
  {
    variants: {
      size: {
        sm: "size-3.5 rounded-sm border-border-mid bg-surface-void",
        default: "size-4 rounded-sm border-border-mid bg-surface-void",
        lg: "size-5 rounded border-border-mid bg-surface-void",
      },
    },
    defaultVariants: {
      size: "default",
    },
  },
);

const iconSizes = { sm: 10, default: 12, lg: 14 } as const;

function Checkbox({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & VariantProps<typeof checkboxVariants>) {
  return (
    <CheckboxPrimitive.Root data-slot="checkbox" className={cn(checkboxVariants({ size }), className)} {...props}>
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check size={iconSizes[size ?? "default"]} weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox, checkboxVariants };

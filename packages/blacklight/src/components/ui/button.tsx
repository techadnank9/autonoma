"use client";

import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 cursor-pointer items-center justify-center rounded-none border border-transparent bg-clip-padding text-xs font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        accent:
          "bg-primary text-primary-foreground shadow-[0_0_15px_var(--accent-glow)] hover:shadow-[0_0_25px_var(--accent-glow)] hover:-translate-y-px",
        cta: "bg-primary text-primary-foreground font-mono text-3xs font-bold uppercase tracking-wider shadow-[0_0_15px_var(--accent-glow)] hover:shadow-[0_0_25px_var(--accent-glow)] hover:-translate-y-px [clip-path:polygon(0.75rem_0,100%_0,100%_100%,0_100%,0_0.75rem)]",
        outline:
          "border-border-mid bg-transparent text-foreground hover:bg-surface-raised hover:border-border-highlight",
        secondary: "bg-surface-raised text-secondary-foreground hover:bg-surface-raised/80",
        ghost: "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
        destructive:
          "bg-status-critical/10 text-status-critical hover:bg-status-critical/20 focus-visible:border-status-critical/40 focus-visible:ring-status-critical/20",
        link: "text-primary-ink underline-offset-4 hover:underline",
      },
      size: {
        default: "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        xs: "h-6 gap-1 px-2 text-xs has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-7 gap-1 px-2.5 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        icon: "size-8",
        "icon-xs": "size-6 [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-7",
        "icon-lg": "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return <ButtonPrimitive data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };

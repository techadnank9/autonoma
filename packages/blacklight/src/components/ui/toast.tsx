"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import { X } from "@phosphor-icons/react/X";
import { type VariantProps, cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const createToastManager = ToastPrimitive.createToastManager;

const toastVariants = cva(
  "group/toast relative border-l-[3px] bg-surface-raised p-4 font-mono text-2xs data-open:animate-in data-open:fade-in-0 data-open:slide-in-from-right-full data-closed:animate-out data-closed:fade-out-0 data-closed:slide-out-to-right-full",
  {
    variants: {
      variant: {
        default: "border-border-mid",
        info: "border-primary bg-accent-dim",
        success: "border-status-success bg-status-success/5",
        warning: "border-status-warn bg-status-warn/5",
        critical: "border-status-critical bg-status-critical/5",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

type ToastVariant = NonNullable<VariantProps<typeof toastVariants>["variant"]>;

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider data-slot="toast-provider" {...props} />;
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn("fixed top-4 right-4 z-50 flex w-96 flex-col gap-2", className)}
      {...props}
    />
  );
}

function Toast({
  className,
  variant,
  toast,
  ...props
}: Omit<ToastPrimitive.Root.Props, "toast"> &
  VariantProps<typeof toastVariants> & { toast: ToastPrimitive.Root.ToastObject }) {
  const resolvedVariant = variant ?? (toast.type as ToastVariant | undefined) ?? "default";
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      data-variant={resolvedVariant}
      toast={toast}
      className={cn(toastVariants({ variant: resolvedVariant }), className)}
      {...props}
    />
  );
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn(
        "mb-1 flex items-center gap-2 text-4xs font-extrabold uppercase tracking-wider",
        "group-data-[variant=default]/toast:text-foreground",
        "group-data-[variant=info]/toast:text-primary-ink",
        "group-data-[variant=success]/toast:text-status-success",
        "group-data-[variant=warning]/toast:text-status-warn",
        "group-data-[variant=critical]/toast:text-status-critical",
        className,
      )}
      {...props}
    />
  );
}

function ToastDescription({ className, ...props }: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-text-secondary", className)}
      {...props}
    />
  );
}

function ToastClose({ className, ...props }: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      className={cn(
        "absolute top-2 right-2 inline-flex size-5 items-center justify-center text-text-tertiary transition-colors hover:text-foreground",
        className,
      )}
      aria-label="Close"
      {...props}
    >
      <X className="size-3" />
    </ToastPrimitive.Close>
  );
}

function ToastAction({ className, ...props }: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      className={cn(
        "mt-2 inline-flex h-6 items-center border border-border-mid bg-surface-base px-2 font-mono text-4xs font-bold uppercase tracking-wider text-foreground transition-colors hover:bg-surface-raised",
        className,
      )}
      {...props}
    />
  );
}

function useToastManager() {
  return ToastPrimitive.useToastManager();
}

export {
  createToastManager,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
  useToastManager,
  toastVariants,
};

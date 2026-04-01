"use client";

import { DrawerPreview as DrawerPrimitive } from "@base-ui/react/drawer";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

const SWIPE_MAP = {
  bottom: "down",
  right: "right",
  left: "left",
} as const;

type DrawerSide = keyof typeof SWIPE_MAP;

function Drawer({
  side = "bottom",
  ...props
}: Omit<DrawerPrimitive.Root.Props, "swipeDirection"> & { side?: DrawerSide }) {
  return <DrawerPrimitive.Root data-slot="drawer" swipeDirection={SWIPE_MAP[side]} {...props} />;
}

function DrawerTrigger({ ...props }: DrawerPrimitive.Trigger.Props) {
  return <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;
}

function DrawerBackdrop({ className, ...props }: DrawerPrimitive.Backdrop.Props) {
  return (
    <DrawerPrimitive.Backdrop
      data-slot="drawer-backdrop"
      className={cn(
        "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0",
        className,
      )}
      {...props}
    />
  );
}

const drawerContentVariants = cva("fixed z-50 bg-surface-raised p-6 font-mono", {
  variants: {
    side: {
      bottom:
        "inset-x-0 bottom-0 border-t border-border-mid max-h-[80vh] data-open:animate-in data-open:slide-in-from-bottom data-closed:animate-out data-closed:slide-out-to-bottom",
      right:
        "inset-y-0 right-0 border-l border-border-mid w-80 max-w-[90vw] data-open:animate-in data-open:slide-in-from-right data-closed:animate-out data-closed:slide-out-to-right",
      left: "inset-y-0 left-0 border-r border-border-mid w-80 max-w-[90vw] data-open:animate-in data-open:slide-in-from-left data-closed:animate-out data-closed:slide-out-to-left",
    },
  },
  defaultVariants: {
    side: "bottom",
  },
});

function DrawerContent({
  className,
  side = "bottom",
  children,
  ...props
}: DrawerPrimitive.Popup.Props & VariantProps<typeof drawerContentVariants>) {
  return (
    <DrawerPrimitive.Portal>
      <DrawerPrimitive.Popup
        data-slot="drawer-content"
        className={cn(drawerContentVariants({ side }), className)}
        {...props}
      >
        {children}
      </DrawerPrimitive.Popup>
    </DrawerPrimitive.Portal>
  );
}

function DrawerHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="drawer-header" className={cn("flex flex-col gap-1 pb-4", className)} {...props} />;
}

function DrawerFooter({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="drawer-footer"
      className={cn("flex justify-end gap-2 border-t border-border-dim pt-4", className)}
      {...props}
    />
  );
}

function DrawerTitle({ className, ...props }: DrawerPrimitive.Title.Props) {
  return (
    <DrawerPrimitive.Title
      data-slot="drawer-title"
      className={cn("font-mono text-sm font-bold uppercase tracking-wider", className)}
      {...props}
    />
  );
}

function DrawerDescription({ className, ...props }: DrawerPrimitive.Description.Props) {
  return (
    <DrawerPrimitive.Description
      data-slot="drawer-description"
      className={cn("font-mono text-2xs text-text-secondary", className)}
      {...props}
    />
  );
}

function DrawerClose({ ...props }: DrawerPrimitive.Close.Props) {
  return <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;
}

export {
  Drawer,
  DrawerTrigger,
  DrawerBackdrop,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
  drawerContentVariants,
};

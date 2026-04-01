import { ScrollArea as ScrollAreaPrimitive } from "@base-ui/react/scroll-area";
import type * as React from "react";

import { cn } from "../../lib/utils";

function ScrollArea({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <ScrollAreaPrimitive.Root className={cn("relative overflow-hidden", className)} {...props}>
      <ScrollAreaPrimitive.Viewport className="h-full w-full overscroll-contain">
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollAreaPrimitive.Scrollbar
        className="flex w-1.5 touch-none select-none p-px transition-colors"
        orientation="vertical"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 bg-border-mid hover:bg-border-highlight" />
      </ScrollAreaPrimitive.Scrollbar>
      <ScrollAreaPrimitive.Scrollbar
        className="flex h-1.5 touch-none select-none flex-col p-px transition-colors"
        orientation="horizontal"
      >
        <ScrollAreaPrimitive.Thumb className="relative flex-1 bg-border-mid hover:bg-border-highlight" />
      </ScrollAreaPrimitive.Scrollbar>
    </ScrollAreaPrimitive.Root>
  );
}

export { ScrollArea };

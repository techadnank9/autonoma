import type * as React from "react";

import { cn } from "../../lib/utils";

const CORNER = "absolute size-2 pointer-events-none z-20 border-border-mid";

function PanelCorners() {
  return (
    <>
      <div className={`${CORNER} top-0 left-0 border-t border-l`} />
      <div className={`${CORNER} top-0 right-0 border-t border-r`} />
      <div className={`${CORNER} bottom-0 left-0 border-b border-l`} />
      <div className={`${CORNER} bottom-0 right-0 border-b border-r`} />
    </>
  );
}

function Panel({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel"
      className={cn("relative flex flex-col border border-border-dim bg-surface-base", className)}
      {...props}
    >
      <PanelCorners />
      {props.children}
    </div>
  );
}

function PanelHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-header"
      className={cn("flex items-center justify-between border-b border-border-dim px-5 py-4", className)}
      {...props}
    />
  );
}

function PanelTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="panel-title"
      className={cn("flex items-center gap-2 font-mono text-2xs font-bold uppercase tracking-wider", className)}
      {...props}
    >
      <span className="inline-block size-1.5 bg-primary" />
      {props.children}
    </div>
  );
}

function PanelBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="panel-body" className={cn("flex-1 p-5", className)} {...props} />;
}

export { Panel, PanelHeader, PanelTitle, PanelBody };

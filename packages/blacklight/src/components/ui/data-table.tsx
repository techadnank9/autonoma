import type * as React from "react";

import { cn } from "../../lib/utils";

function DataTable({ className, ...props }: React.ComponentProps<"table">) {
  return (
    <table data-slot="data-table" className={cn("w-full border-collapse font-mono text-2xs", className)} {...props} />
  );
}

function DataTableHead({ className, ...props }: React.ComponentProps<"thead">) {
  return <thead data-slot="data-table-head" className={cn("", className)} {...props} />;
}

function DataTableBody({ className, ...props }: React.ComponentProps<"tbody">) {
  return <tbody data-slot="data-table-body" className={cn("", className)} {...props} />;
}

function DataTableRow({ className, ...props }: React.ComponentProps<"tr">) {
  return (
    <tr data-slot="data-table-row" className={cn("transition-colors hover:text-primary-ink", className)} {...props} />
  );
}

function DataTableHeaderCell({
  className,
  align,
  ...props
}: React.ComponentProps<"th"> & { align?: "left" | "right" }) {
  return (
    <th
      data-slot="data-table-header-cell"
      className={cn(
        "border-b border-border-mid py-3 text-left font-mono text-4xs font-normal uppercase tracking-widest text-text-secondary",
        align === "right" && "text-right",
        className,
      )}
      {...props}
    />
  );
}

function DataTableCell({ className, align, ...props }: React.ComponentProps<"td"> & { align?: "left" | "right" }) {
  return (
    <td
      data-slot="data-table-cell"
      className={cn("border-b border-border-dim py-3 text-text-primary", align === "right" && "text-right", className)}
      {...props}
    />
  );
}

export { DataTable, DataTableHead, DataTableBody, DataTableRow, DataTableHeaderCell, DataTableCell };

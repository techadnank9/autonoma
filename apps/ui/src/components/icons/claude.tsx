import { cn } from "@autonoma/blacklight";

export function Claude({ className }: { className?: string }) {
  return <img src="/claude.svg" alt="Claude" className={cn("size-4", className)} />;
}

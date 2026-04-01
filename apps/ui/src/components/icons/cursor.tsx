import { cn } from "@autonoma/blacklight";

export function Cursor({ className }: { className?: string }) {
  return <img src="/cursor.svg" alt="Cursor" className={cn("size-4", className)} />;
}

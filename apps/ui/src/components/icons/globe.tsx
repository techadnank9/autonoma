import { cn } from "@autonoma/blacklight";

export function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="-90 -90 180 180" className={cn("w-[560px] text-edge", className)}>
      <title>Globe</title>
      {/* Outer sphere */}
      <circle cx="0" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="0.7" />
      {/* Latitude ellipses */}
      <ellipse cx="0" cy="0" rx="80" ry="18" fill="none" stroke="currentColor" strokeWidth="0.65" />
      <ellipse cx="0" cy="0" rx="80" ry="44" fill="none" stroke="currentColor" strokeWidth="0.65" />
      <ellipse cx="0" cy="0" rx="80" ry="66" fill="none" stroke="currentColor" strokeWidth="0.65" />
      {/* Longitude ellipses */}
      <ellipse cx="0" cy="0" rx="18" ry="80" fill="none" stroke="currentColor" strokeWidth="0.65" />
      <ellipse cx="0" cy="0" rx="44" ry="80" fill="none" stroke="currentColor" strokeWidth="0.65" />
      <ellipse cx="0" cy="0" rx="66" ry="80" fill="none" stroke="currentColor" strokeWidth="0.65" />
    </svg>
  );
}

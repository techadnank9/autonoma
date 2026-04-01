import { cn } from "../../lib/utils";
import { getUI } from "./display-command";

export function InteractionBadge({ interaction }: { interaction: string }) {
  const { name, badgeClassName } = getUI(interaction);
  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded border px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide",
        badgeClassName,
      )}
    >
      {name}
    </span>
  );
}

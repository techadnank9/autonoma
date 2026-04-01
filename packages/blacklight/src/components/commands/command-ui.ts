export interface CommandUI {
    /** A short name for the command. Avoid capitalization. */
    name: string;

    /** How to display the command's instruction. */
    instruction: (params: Record<string, unknown>) => React.ReactNode;

    /** The icon component for the command. */
    iconComponent: React.ComponentType<{ className?: string }>;

    /** The color of the command. */
    color: string;

    /** Badge Tailwind classes for badge styling. */
    badgeClassName: string;
}

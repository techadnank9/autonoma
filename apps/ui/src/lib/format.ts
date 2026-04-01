/** Format a date to a human-readable string. */
export function formatDate(date: Date) {
    return date.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

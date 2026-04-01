/**
 * A simple key-value store for the execution agent to persist extracted values
 * across steps. Commands like `read` and `save-clipboard` write to this store,
 * and any command can reference stored values via `{{variableName}}` templates.
 */
export class MemoryStore {
    private readonly store = new Map<string, string>();

    set(key: string, value: string): void {
        this.store.set(key, value);
    }

    get(key: string): string | undefined {
        return this.store.get(key);
    }

    has(key: string): boolean {
        return this.store.has(key);
    }

    getAll(): Record<string, string> {
        return Object.fromEntries(this.store);
    }

    clear(): void {
        this.store.clear();
    }

    get size(): number {
        return this.store.size;
    }
}

export interface TypeOptions {
    /** If true, select all existing text before typing so the new text replaces it. */
    overwrite?: boolean;
}

/** Basic interface for keyboard interaction */
export interface KeyboardDriver {
    /** Select all text in the currently focused element */
    selectAll(): Promise<void>;

    /** Clear the content of the currently focused element */
    clear(): Promise<void>;

    /** Type a given text into the keyboard */
    type(text: string, options?: TypeOptions): Promise<void>;

    /** Press a given key on the keyboard */
    press(key: string): Promise<void>;
}

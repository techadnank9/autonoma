export interface ClipboardDriver {
    /** Read the current text content from the clipboard. */
    read(): Promise<string>;
}

import type { ClipboardDriver } from "../../platform";

/**
 * A clipboard driver used for testing purposes. Returns a pre-configured text value.
 */
export class FakeClipboardDriver implements ClipboardDriver {
    constructor(private content = "") {}

    setContent(content: string) {
        this.content = content;
    }

    async read(): Promise<string> {
        return this.content;
    }
}

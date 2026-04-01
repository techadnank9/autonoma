import type { KeyboardDriver, TypeOptions } from "../../platform";

export class FakeKeyboardDriver implements KeyboardDriver {
    /** The text inputted by the driver */
    private _text = "";

    /** Whether selectAll was called before the last type */
    private _selectedAll = false;

    public get selectedAll(): boolean {
        return this._selectedAll;
    }

    public async selectAll(): Promise<void> {
        this._selectedAll = true;
    }

    public async clear(): Promise<void> {
        this._text = "";
        this._selectedAll = false;
    }

    public get text(): string {
        return this._text;
    }

    async press(key: string): Promise<void> {
        this._text += key;
    }

    async type(text: string, options?: TypeOptions): Promise<void> {
        if (options?.overwrite === true) {
            await this.selectAll();
        }
        this._text += text;
    }
}

import type { Point } from "@autonoma/image";

export interface ScrollArgs {
    /** The point at which to scroll */
    point?: Point;
    direction: "up" | "down";
}

/** Basic interface for mouse interaction */
export interface MouseDriver<TClickOptions extends object = Record<string, never>> {
    /** Click the mouse at a given position */
    click(x: number, y: number, options?: TClickOptions): Promise<void>;

    /** Hover the mouse at a given position. Only meaningful on web (pointer-based) platforms. */
    hover?(x: number, y: number): Promise<void>;

    /** Drag the mouse from one position to another */
    drag(startX: number, startY: number, endX: number, endY: number): Promise<void>;

    /** Scroll at a specific position on the screen */
    scroll(args: ScrollArgs): Promise<void>;
}

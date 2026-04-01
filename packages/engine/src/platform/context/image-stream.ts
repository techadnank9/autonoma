export interface ImageStream {
    /** Start the image stream */
    start(): Promise<void>;

    /** Add a callback to receive the image as a base64 string */
    addFrameHandler(callback: (image: string) => void | Promise<void>): void;

    /** Stop the image stream */
    stop(): Promise<void>;
}

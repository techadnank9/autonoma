/** An interface with some type of object storage. */
export interface StorageProvider {
    /** Upload a file to the storage provider. Returns the internal key of the file. */
    upload(key: string, data: Buffer): Promise<string>;
    /** Upload a file from a stream without buffering the entire body in memory. Returns the internal key of the file. */
    uploadStream(key: string, stream: ReadableStream, contentType?: string): Promise<string>;
    /** Download a file from the storage provider. */
    download(key: string): Promise<Buffer>;
    /** Delete a file from the storage provider. */
    delete(key: string): Promise<void>;
    /** Get a signed URL for a file from the storage provider. This is publicly accessible */
    getSignedUrl(key: string, expiresInSeconds: number): Promise<string>;
}

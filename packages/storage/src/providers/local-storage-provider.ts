import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { pipeline } from "node:stream/promises";
import type { ReadableStream as NodeReadableStream } from "node:stream/web";
import type { StorageProvider } from "../storage-provider";

export class LocalStorageProvider implements StorageProvider {
    constructor(private readonly baseDir: string) {}

    async upload(key: string, data: Buffer): Promise<string> {
        const filePath = path.join(this.baseDir, key);
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(filePath, data as unknown as Uint8Array);
        return `file://${filePath}`;
    }

    async uploadStream(key: string, stream: ReadableStream): Promise<string> {
        const filePath = path.join(this.baseDir, key);
        const dir = path.dirname(filePath);
        fs.mkdirSync(dir, { recursive: true });
        const nodeStream = Readable.fromWeb(stream as NodeReadableStream);
        await pipeline(nodeStream, fs.createWriteStream(filePath));
        return `file://${filePath}`;
    }

    async download(key: string): Promise<Buffer> {
        const filePath = path.join(this.baseDir, key);
        return fs.readFileSync(filePath);
    }

    async delete(key: string): Promise<void> {
        const filePath = path.join(this.baseDir, key);
        fs.unlinkSync(filePath);
    }

    async getSignedUrl(key: string): Promise<string> {
        const filePath = path.join(this.baseDir, key);
        return `file://${filePath}`;
    }
}

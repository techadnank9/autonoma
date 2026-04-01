import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { rm } from "node:fs/promises";
import { join } from "node:path";

const testDir = import.meta.dirname;
const fixturesDir = join(testDir, "fixtures");
const archivePath = join(testDir, "fixtures.tar.gz");

export async function setup(): Promise<void> {
    if (existsSync(fixturesDir)) {
        await rm(fixturesDir, { recursive: true });
    }
    execSync(`tar -xzf ${archivePath} -C ${testDir}`);
}

export async function teardown(): Promise<void> {
    if (existsSync(fixturesDir)) {
        await rm(fixturesDir, { recursive: true });
    }
}

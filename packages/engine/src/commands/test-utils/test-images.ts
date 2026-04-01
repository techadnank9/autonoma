import { readFileSync } from "node:fs";
import path from "node:path";
import { Screenshot } from "@autonoma/image";

const IMAGE_DIR = path.join(import.meta.dirname, "test-images");

function loadFromDisk(name: string): Screenshot {
    const filePath = path.join(IMAGE_DIR, `${name}.png`);
    const buffer = readFileSync(filePath);

    return Screenshot.fromBuffer(buffer);
}

const TEST_IMAGE_LOADING = {
    MELI_HOMEPAGE: () => loadFromDisk("meli-homepage"),
    LUXURY_DASHBOARD: () => loadFromDisk("luxury-dashboard"),
    KAVAK_HOMEPAGE: () => loadFromDisk("kavak-homepage"),
    KAVAK_HOMEPAGE_SCROLLED: () => loadFromDisk("kavak-homepage-scrolled"),
    KAVAK_CAR_LIST: () => loadFromDisk("kavak-car-list"),
    GITHUB_ISSUE_LABELS_1: () => loadFromDisk("github-issue-labels-1"),
    GITHUB_ISSUE_LABELS_2: () => loadFromDisk("github-issue-labels-2"),
};

export function getTestImage(name: keyof typeof TEST_IMAGE_LOADING): Screenshot {
    return TEST_IMAGE_LOADING[name]();
}

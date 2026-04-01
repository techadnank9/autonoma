import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import type z from "zod";
import type { TestCase } from "../agent";
import type { SkillsConfig, SkillsRecord } from "../agent/tools/skill-resolver-tool";

export class LoadTestCaseError extends Error {
    constructor(cause: Error) {
        super(`Failed to load test case: ${cause.message}`, { cause });
    }
}

/**
 * Walk up the directory tree from the test case file looking for an
 * `autonoma/skills/` directory containing skill files.
 *
 * Each skill file is a markdown file with frontmatter containing `name` and `description`.
 *
 * Expected structure:
 * ```
 * root/
 * ├── qa-tests/
 * │   └── sub-folder/
 * │       └── test-case.md     ← filePath (any depth)
 * └── autonoma/
 *     └── skills/              ← individual skill files with frontmatter
 * ```
 */
async function loadSkillsConfig(filePath: string): Promise<SkillsConfig | undefined> {
    let currentDir = path.dirname(path.resolve(filePath));
    const root = path.parse(currentDir).root;

    while (currentDir !== root) {
        const skillsDir = path.join(currentDir, "autonoma", "skills");

        try {
            const skillRecord = await loadSkills(skillsDir);

            if (Object.keys(skillRecord).length === 0) {
                currentDir = path.dirname(currentDir);
                continue;
            }

            return { skillRecord };
        } catch {
            // Not found at this level, continue walking up
        }

        currentDir = path.dirname(currentDir);
    }

    return undefined;
}

async function loadSkills(skillsDir: string): Promise<SkillsRecord> {
    const entries = await fs.readdir(skillsDir, { withFileTypes: true });
    const markdownFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith(".md"));

    const skillEntries = await Promise.all(
        markdownFiles.map(async (entry) => {
            const skillKey = entry.name.slice(0, -3);
            const skillPath = path.join(skillsDir, entry.name);
            const raw = await fs.readFile(skillPath, "utf-8");
            const { data, content: body } = matter(raw);

            const name = typeof data.name === "string" ? data.name : skillKey;
            const description = typeof data.description === "string" ? data.description : "";

            return [skillKey, { name, description, content: body.trim() }] as const;
        }),
    );

    return Object.fromEntries(skillEntries);
}

/**
 * Load a test case from a given markdown file.
 *
 * @param filePath - The path to the markdown file.
 * @param paramsSchema - The schema of the application data parameters. These will be read from the gray-matter frontmatter
 * @returns The test case, combining BaseTestCase fields with the application data.
 */
export async function loadTestCase<TApplicationData>(
    filePath: string,
    paramsSchema: z.Schema<TApplicationData>,
): Promise<TestCase & TApplicationData> {
    const content = await fs.readFile(filePath, "utf-8");
    const { data, content: body } = matter(content);

    // The name is the filename without the extension
    const name = path.basename(filePath, path.extname(filePath));

    const parseResult = paramsSchema.safeParse(data);
    if (!parseResult.success) throw new LoadTestCaseError(parseResult.error);

    const skillsConfig = await loadSkillsConfig(filePath);

    return { name, prompt: body, skillsConfig, ...parseResult.data };
}

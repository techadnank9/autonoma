import { readFileSync } from "node:fs";
import path from "node:path";

export const DEFAULT_AGENT_SYSTEM_PROMPT = readFileSync(
    path.join(import.meta.dirname, "system-prompt.md"),
    "utf8",
).trim();

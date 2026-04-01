import { spawn } from "node:child_process";

export function triggerLocalReview(generationId: string): void {
    spawn("pnpm", ["--filter", "@autonoma/generation-reviewer", "review", generationId], {
        stdio: "inherit",
    });
}

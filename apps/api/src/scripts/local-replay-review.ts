import { spawn } from "node:child_process";

export function triggerLocalReplayReview(runId: string): void {
    spawn("pnpm", ["--filter", "@autonoma/replay-reviewer", "review", runId], {
        stdio: "inherit",
    });
}

# @autonoma/review

AI-powered review agent for analyzing failed test executions. Given a test run's video recording, step screenshots, and conversation history, it classifies the failure as either an `agent_error` (the test agent misbehaved) or an `application_bug` (a real defect in the application under test).

## How It Works

The review agent is built on the Vercel AI SDK's `ToolLoopAgent`. It receives the execution context (system prompt, messages with video/screenshots) and iteratively inspects evidence using tools until it calls `submit_verdict` or hits the 15-step limit.

**Agent loop:**

1. Model receives execution context (conversation log, video, step metadata)
2. Model calls `view_step_screenshot` or `view_final_screenshot` to inspect specific moments
3. Model calls `submit_verdict` with a structured `ReviewVerdict` to end the loop

## Exports

### `@autonoma/review`

| Export | Type | Description |
|--------|------|-------------|
| `runReviewAgent` | function | Runs the review agent loop and returns a `ReviewAgentResult` |
| `buildReviewTools` | function | Builds the tool set (`view_step_screenshot`, `view_final_screenshot`, `submit_verdict`) |
| `extractVerdict` | function | Extracts a `ReviewVerdict` from agent step tool calls |
| `tryUploadVideo` | function | Downloads and uploads a video recording to the GenAI Files API |
| `ReviewAgentResult` | type | `{ verdict: ReviewVerdict \| undefined }` |
| `ScreenshotLoader` | interface | `{ loadScreenshot(key: string): Promise<Buffer> }` |
| `ReviewStepScreenshots` | interface | Step metadata with optional before/after screenshot keys |
| `BuildReviewToolsParams` | interface | Params for `buildReviewTools` |
| `VideoDownloader` | interface | `{ downloadVideo(key: string): Promise<Buffer> }` |

### `@autonoma/review/env`

Validated environment config via `createEnv`. Extends `@autonoma/logger/env`, `@autonoma/storage/env`, and `@autonoma/ai/env`. No additional env vars of its own.

## Usage

```ts
import { runReviewAgent, buildReviewTools, tryUploadVideo } from "@autonoma/review";
import type { ScreenshotLoader, VideoDownloader } from "@autonoma/review";

// 1. Build tools with your storage adapter
const tools = buildReviewTools({
    screenshotLoader: myScreenshotLoader,  // implements ScreenshotLoader
    steps: [
        { order: 0, screenshotBeforeKey: "s3://before-0.png", screenshotAfterKey: "s3://after-0.png" },
        { order: 1, screenshotBeforeKey: "s3://before-1.png", screenshotAfterKey: "s3://after-1.png" },
    ],
    finalScreenshotKey: "s3://final.png",
});

// 2. Optionally upload video for multimodal context
const uploadedVideo = await tryUploadVideo(videoKey, myVideoDownloader, videoProcessor);

// 3. Run the agent
const { verdict } = await runReviewAgent(model, systemPrompt, tools, messages);

if (verdict != null) {
    console.log(verdict.verdict);     // "agent_error" | "application_bug"
    console.log(verdict.confidence);  // 0-100
    console.log(verdict.severity);    // "critical" | "high" | "medium" | "low"
    console.log(verdict.title);       // Short summary
    console.log(verdict.reasoning);   // Detailed explanation
}
```

## ReviewVerdict Shape

The `submit_verdict` tool uses the `reviewVerdictSchema` from `@autonoma/types`:

```ts
{
    verdict: "agent_error" | "application_bug";
    confidence: number;          // 0-100
    severity: "critical" | "high" | "medium" | "low";
    title: string;               // Short summary (under 100 chars)
    reasoning: string;           // Detailed explanation
    failurePoint: {
        stepOrder?: number;      // Step where failure occurred
        description: string;     // What happened at point of failure
    };
    evidence: Array<{
        type: "conversation" | "screenshot" | "video" | "step_output";
        description: string;
    }>;
}
```

## Architecture Notes

- **Platform-agnostic** - the package defines interfaces (`ScreenshotLoader`, `VideoDownloader`) rather than depending on a specific storage backend. Callers inject their own implementations.
- **Graceful degradation** - `tryUploadVideo` catches download/upload failures and returns `undefined` rather than throwing, so reviews can proceed without video.
- **Max 15 steps** - the agent is capped at 15 tool-call iterations to bound cost and latency.
- **Verdict extraction** - `extractVerdict` scans all agent steps for a `submit_verdict` tool call. If the agent hits the step limit without submitting, it returns `undefined`.

## Dependencies

- `@autonoma/ai` - model types, video processing
- `@autonoma/logger` - structured logging
- `@autonoma/storage` - storage env config
- `@autonoma/types` - `ReviewVerdict` schema and type
- `ai` (Vercel AI SDK) - `ToolLoopAgent`, tool definitions, message types
- `zod` - schema definitions

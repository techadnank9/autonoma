# @autonoma/engine-web

Playwright-based web test execution engine for the Autonoma testing platform. This app implements the platform-specific driver interfaces defined in `@autonoma/engine` (execution-agent) using Playwright, enabling AI-driven end-to-end web testing on Chromium browsers.

## Tech Stack

- **Runtime:** Node.js (ESM-only)
- **Browser Automation:** Playwright (Chromium)
- **AI:** Gemini models via `@autonoma/ai` for element detection, assertions, and agent reasoning
- **Database:** Prisma (PostgreSQL) via `@autonoma/db`
- **Storage:** S3 via `@autonoma/storage`
- **Logging:** Sentry via `@autonoma/logger`

## Directory Structure

```
src/
├── index.ts                          # Package re-exports
├── platform/                         # Playwright driver implementations
│   ├── drivers/
│   │   ├── playwright-screen.driver.ts
│   │   ├── playwright-mouse.driver.ts
│   │   ├── playwright-keyboard.driver.ts
│   │   ├── playwright-clipboard.driver.ts
│   │   ├── playwright-application.driver.ts
│   │   ├── playwright-navigation.driver.ts
│   │   └── connect-remote-browser.ts
│   ├── web-installer.ts
│   ├── web-context.ts
│   ├── web-video-recorder.ts
│   ├── playwright-image-stream.ts
│   ├── active-page-manager.ts
│   ├── scenario-auth.ts
│   └── env.ts
├── execution-agent/                  # AI agent wiring
│   ├── web-agent/
│   │   ├── web-agent-factory.ts
│   │   └── web-agent-types.ts
│   ├── generation-api/
│   │   └── run-generation-job.ts
│   ├── local-dev/
│   │   ├── run-execution.ts
│   │   └── cost-summary.ts
│   └── env.ts
├── replay/                           # Deterministic replay of recorded steps
│   ├── run-replay-job.ts
│   ├── run-api-runner.ts
│   ├── web-command-spec.ts
│   └── web-commands.ts
test-prompts/                         # Sample markdown test cases for local dev
```

## Running

### Local Development

Run a test case from a markdown file:

```bash
pnpm dev <path-to-test-prompt>
```

Example:

```bash
pnpm dev test-prompts/yc-graham-essays.md
```

This launches a local Chromium browser, executes the AI agent against the test prompt, and saves artifacts (screenshots, steps, video) to a local directory.

### Production Jobs

**Generation job** - executes an AI-driven test generation:

```bash
pnpm run-generation <testGenerationId>
```

**Replay job** - replays previously recorded steps:

```bash
pnpm run-replay <testRunId>
```

In production, these run as Kubernetes Jobs with a remote browser sidecar.

### Other Commands

```bash
pnpm build        # Compile TypeScript
pnpm typecheck    # Type-check without emitting
pnpm lint         # Run Biome linter
pnpm test         # Run Vitest tests
```

## Environment Variables

Defined in `src/execution-agent/env.ts` and `src/platform/env.ts` using `@t3-oss/env-core`:

| Variable | Required | Description |
|----------|----------|-------------|
| `REMOTE_BROWSER_URL` | No | WebSocket endpoint for a remote Chromium instance (e.g., `127.0.0.1:3000`). If unset, launches a local browser. |
| `HEADLESS` | No | Set to `"true"` to run Chromium in headless mode. Defaults to headed. |

Additionally, environment variables are inherited from shared packages (`@autonoma/logger`, `@autonoma/db`, `@autonoma/ai`, `@autonoma/storage`).

## Architecture Notes

- **Platform-agnostic core.** All AI agent logic, command abstractions, and the execution loop live in `@autonoma/engine`. This app only provides Playwright-specific driver implementations.
- **WebContext** bundles all Playwright drivers (screen, mouse, keyboard, clipboard, application, navigation) into a single object the agent commands operate on.
- **Remote browser support.** In production, the engine connects to a remote Chromium instance via WebSocket rather than launching a local browser.
- **Video recording** uses Playwright's built-in per-page video API.
- **ActivePageManager** tracks which page is currently active, handling new tabs/popups transparently so drivers always operate on the correct page.
- **Default viewport** is 1920x1080 across all entry points.
- **Agent tools** include: click, hover, drag, type, assert, scroll, refresh, read (text extraction), and save-clipboard.

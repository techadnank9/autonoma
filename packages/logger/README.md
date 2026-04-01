# @autonoma/logger

Structured logging package for all Autonoma backend services. Wraps Sentry for production error tracking and provides colorized console output for local development.

## Exports

| Export | Description |
|--------|-------------|
| `logger` | Root logger singleton (`rootLogger`) - the primary entry point for logging |
| `Logger` | Type alias for `SentryLogger` - use in function signatures accepting a logger |
| `createSentryConfig` | Builds a `@sentry/node` `NodeOptions` config from a scope config |
| `runWithSentry` | Initializes Sentry + runs an async job with proper flush and exit handling |
| `RunWithSentryOptions` | Options type for `runWithSentry` |

A secondary export path `@autonoma/logger/env` exposes the validated environment config.

## Usage

### Root logger

```ts
import { logger } from "@autonoma/logger";

logger.info("Server started", { port: 4000 });
logger.error("Request failed", new Error("timeout"), { route: "/api/test" });
logger.warn("Slow query", { duration: 1200 });
logger.debug("Cache hit", { key: "user:123" });
```

### Child loggers (classes)

Every class should create a child logger with its name and identifying context. Child loggers inherit all parent bindings and propagate them into Sentry scope/extras.

```ts
import { type Logger, logger } from "@autonoma/logger";

class TestRunner {
    private readonly logger: Logger;

    constructor(private readonly runId: string) {
        this.logger = logger.child({ name: this.constructor.name, runId });
    }

    run() {
        this.logger.info("Starting test run");
        // logs include { name: "TestRunner", runId: "..." } automatically
    }
}
```

### Accepting a logger parameter

Reusable functions called from classes should accept a `Logger` parameter to preserve the caller's context chain.

```ts
import type { Logger } from "@autonoma/logger";

function processResult(result: Result, logger: Logger) {
    logger.info("Processing result", { status: result.status });
}
```

### Running a job with Sentry

`runWithSentry` initializes Sentry, executes the provided async function, flushes events, and calls `process.exit`. Use this as the entry point for K8s jobs.

```ts
import { logger, runWithSentry } from "@autonoma/logger";

await runWithSentry({ name: "my-job", tags: { queue: "default" } }, async () => {
    logger.info("Job started");
    // ... do work ...
});
```

### Sentry config for long-running services

For services (API server, engines), initialize Sentry manually with `createSentryConfig`:

```ts
import * as Sentry from "@sentry/node";
import { createSentryConfig } from "@autonoma/logger";

Sentry.init(createSentryConfig({
    contextType: "api-server",
    contextName: "api",
    tags: { service: "api" },
}));
```

## Log levels

| Method | When to use |
|--------|-------------|
| `debug` | Verbose details - only printed when `DEBUG=true` or outside production |
| `info` | Normal operational events |
| `warn` | Unexpected but recoverable situations |
| `error` | Failures with optional `Error` object as second argument |
| `fatal` | Unrecoverable errors - also captured as Sentry exceptions |
| `captureError` | Directly capture an error to Sentry with optional severity |

## Architecture

### Dual-mode output

- **Production** (`NODE_ENV=production`): logs are sent to Sentry via `@sentry/node` logger and also printed in plain text to stdout/stderr.
- **Development**: logs are pretty-printed with ANSI colors and timestamps. Sentry calls are skipped entirely (no DSN configured).

### Class hierarchy

- `ConsoleLogger` - low-level structured console output with `child()` support and colorized formatting.
- `SentryLogger` (abstract) - adds Sentry integration, execution mode tracking, user context, and convenience methods (`info`, `error`, `warn`, etc.).
- `BackendLogger` (concrete) - implements all abstract Sentry methods. Merges bindings into Sentry scope extras and console output.

### Root logger proxy

`rootLogger` is a lazy proxy object that delegates to a `BackendLogger` singleton. This avoids import-order issues - the instance is created on first access.

### Environment variables

Validated with `@t3-oss/env-core` + Zod in `env.ts`:

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Controls Sentry activation and log formatting |
| `SENTRY_DSN` | - | Sentry project DSN (required in production) |
| `SENTRY_ENV` | `production` | Sentry environment tag |
| `SENTRY_RELEASE` | `unknown` | Release version for Sentry |
| `DEBUG` | - | Set to `"true"` to enable debug logs in production |

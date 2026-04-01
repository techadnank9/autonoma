# @autonoma/scenario

Manages scenario lifecycle (discover, up, down) for test environments provisioned via customer-hosted webhooks. A "scenario" is a pre-configured environment (e.g. seeded database, deployed preview) that an application exposes through a webhook endpoint so Autonoma can spin it up before a test run and tear it down afterward.

## Exports

| Export | Description |
|---|---|
| `ScenarioManager` | Core orchestrator - discovers available scenarios, provisions instances (up), and tears them down (down) |
| `WebhookClient` | HMAC-signed HTTP client that calls customer webhook endpoints with retry and response validation |
| `EncryptionHelper` | AES-256-GCM encryption/decryption for webhook signing secrets stored in the database |
| `ScenarioSubject` | Interface representing the entity (run or generation) that needs a scenario |
| `GenerationSubject` | `ScenarioSubject` implementation backed by a test generation |
| `RunSubject` | `ScenarioSubject` implementation backed by a test run |

## Usage

```ts
import { ScenarioManager, EncryptionHelper, RunSubject } from "@autonoma/scenario";

// Initialize
const encryption = new EncryptionHelper(process.env.SCENARIO_ENCRYPTION_KEY);
const manager = new ScenarioManager(prisma, encryption);

// Discover scenarios registered by an application's webhook
await manager.discover(applicationId);

// Spin up a scenario instance before a test run
const subject = new RunSubject(prisma, runId);
const instance = await manager.up(subject, scenarioId);

// Tear down the instance after the run completes
await manager.down(instance.id);
```

## Architecture

### Scenario lifecycle

1. **Discover** - Calls the application's webhook with `action: "discover"`. The webhook returns a list of available environments (name, description, optional fingerprint). These are upserted into the `scenario` table. Fingerprint changes are tracked to detect environment drift.

2. **Up** - Creates a `scenarioInstance` record in `REQUESTED` status, links it to the subject (run or generation), then calls the webhook with `action: "up"`. On success, the instance is updated to `UP_SUCCESS` with auth credentials, refs, and metadata returned by the webhook. On failure, it transitions to `UP_FAILED`.

3. **Down** - Calls the webhook with `action: "down"`, passing back the `refs` and `refsToken` from the up response so the customer can clean up. Transitions to `DOWN_SUCCESS` or `DOWN_FAILED`. Already-torn-down instances are skipped.

### Webhook signing

All webhook requests are signed with HMAC-SHA256 using a per-application signing secret. The secret is stored encrypted (AES-256-GCM) in the database and decrypted at call time via `EncryptionHelper`. The signature is sent in the `x-signature` header.

### Retry behavior

- **discover/up**: 2 retries, 30s timeout
- **down**: 5 retries, 60s timeout
- Exponential backoff between retries (1s, 2s, 4s, ..., capped at 30s)

### ScenarioSubject pattern

`ScenarioSubject` abstracts the entity that needs a scenario. This lets `ScenarioManager.up()` work identically for test generations and test runs without knowing which one it is dealing with. Each subject knows how to:
- Resolve its scenario ID from the database
- Fetch the associated application's webhook configuration
- Link the created scenario instance back to itself

### Instance expiration

Instances default to a 2-hour TTL. If the webhook's `up` response includes `expiresInSeconds`, that value overrides the default.

## Testing

Tests use Testcontainers with a real PostgreSQL database via `@autonoma/integration-test`.

```bash
pnpm test
```

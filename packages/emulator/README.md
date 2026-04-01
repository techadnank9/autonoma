# @autonoma/emulator

Emulator/simulator management for mobile test execution. Handles device acquisition via HTTP daemon locking, Appium capability building, and device preparation for both iOS and Android platforms.

## Exports

| Export | Type | Description |
|--------|------|-------------|
| `Emulator` | Class | Main entry point - acquires a device lock, exposes connection details (IP, ports), prepares devices, and releases locks |
| `DaemonClient` | Class | HTTP client for the emulator-daemon service (lock acquire/release/ping, simulator log download) |
| `buildIosCapabilities` | Function | Builds Appium XCUITest capabilities from an `Emulator` instance |
| `buildAndroidCapabilities` | Function | Builds Appium UiAutomator2 capabilities from an `Emulator` instance |
| `buildLockOwner` | Function | Constructs a `"userId:runId"` lock owner string |
| `parseLockOwner` | Function | Parses a lock owner string back into `{ userId, runId }` |
| `isValidLockOwner` | Function | Type guard for the `"userId:runId"` format |
| `parseDaemonHosts` | Function | Splits a comma-separated daemon hosts string into an array |
| `LockOwnerParamsSchema` | Zod Schema | Validation schema for lock owner params |

### Types

`DeviceInfo`, `EmulatorConfig`, `DeviceDriver`, `Contact`, `EmulatorCreateOptions`, `PrepareDeviceOptions`, `ProxyConfig`, `DaemonLockInfo`, `LockOwnerParams`

## Usage

### Creating an emulator and acquiring a device

```ts
import { Emulator, buildLockOwner, parseDaemonHosts } from "@autonoma/emulator";

const emulator = await Emulator.create({
  config: {
    nodeEnv: "production",
    architecture: "IOS",
  },
  owner: buildLockOwner("org-123", "run-456"),
  daemonHosts: parseDaemonHosts(env.DAEMON_HOSTS), // e.g. "host1,host2,host3"
});

// emulator.ip, emulator.appiumPort, emulator.mjpegPort, etc. are now available
```

In development mode (`nodeEnv !== "production"`), no daemon is contacted - a dummy localhost device is used instead.

### Building Appium capabilities

```ts
import { buildIosCapabilities, buildAndroidCapabilities } from "@autonoma/emulator";

const caps = buildIosCapabilities(emulator, true, false);
// or
const caps = buildAndroidCapabilities(emulator);
```

### Preparing a device for testing

```ts
await emulator.prepareDevice(driver, {
  appPath: "/path/to/app.ipa",
  appPackage: "com.example.app",
  contacts: [{ name: "Jane Doe", phone: "+1234567890", email: "jane@example.com" }],
  proxyConfig: { organizationId: "org-1", proxyOrgIds: ["org-1"], proxyHost: "proxy.local", proxyPort: 8080 },
});
```

### Waiting for Appium and releasing

```ts
await emulator.waitForAppium(); // polls /status until ready (up to 2 minutes)

// When done:
await emulator.release("test-runner");
```

## Architecture

### Device acquisition flow

1. `Emulator.create()` is the static factory. In production, it shuffles the provided daemon hosts and tries each in a loop until one returns a lock.
2. `DaemonClient.acquireLock()` sends `POST /lock` to the daemon, which returns port assignments (Appium, MJPEG, WDA/system port) and a lock token.
3. The client starts a background ping interval (every 15s) to keep the lock alive.
4. On `release()`, the client sends `DELETE /lock/:deviceId` and stops pinging.

### Device preparation

- **iOS** (`IosPrepareDevice`): Dismisses alerts, waits for WDA readiness, clears keychains, installs the app, and activates it.
- **Android** (`AndroidPrepareDevice`): Disables Wi-Fi, optionally sets HTTP proxy, uninstalls all non-system third-party apps, re-enables Wi-Fi, installs the test app, injects contacts, and sets the device date.

### Lock owner format

Lock owners follow the `"userId:runId"` convention, validated by `LockOwnerParamsSchema`. This identifies who holds a device lock and prevents collisions between concurrent runs from the same user.

### Instance expiration

Instances default to a 2-hour TTL. If the webhook's `up` response includes `expiresInSeconds`, that value overrides the default.

## Dependencies

- `@autonoma/logger` - structured logging
- `zod` - schema validation (lock owner params)

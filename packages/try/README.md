# @autonoma/try

Go-style error handling for TypeScript. Wraps fallible operations into `[value, error]` tuples, eliminating try/catch blocks and making error paths explicit at every call site.

## Exports

### Types

- **`Try<T>`** - Union of `Success<T> | Failure`. A tuple: `[T, null]` on success, `[null, Error]` on failure.
- **`Success<T>`** - `[T, null]`
- **`Failure`** - `[null, Error]`

### `fx` namespace

All functions are accessed through the `fx` object:

| Function | Description |
|----------|-------------|
| `fx.runAsync(fn)` | Wraps an async function in a try/catch, returns `Promise<Try<T>>` |
| `fx.run(fn)` | Wraps a sync function in a try/catch, returns `Try<T>` |
| `fx.success(value)` | Creates a `Success<T>` tuple |
| `fx.failure(error)` | Creates a `Failure` tuple. Non-Error values are wrapped in `new Error(String(error))` |
| `fx.flatten(tries)` | Takes `Try<T>[]`, returns `Try<T[]>`. Short-circuits on first failure |
| `fx.filterFailures(tries)` | Takes `Try<T>[]`, returns only the success values as `T[]` |

## Usage

```ts
import { fx, type Try } from "@autonoma/try";

// Async operation
async function fetchUser(id: string): Promise<Try<User>> {
    const [user, error] = await fx.runAsync(() => db.user.findUniqueOrThrow({ where: { id } }));
    if (error != null) return fx.failure(error);
    return fx.success(user);
}

// Sync operation
const [parsed, error] = fx.run(() => JSON.parse(raw));
if (error != null) {
    // handle parse failure
}

// Chaining multiple fallible operations
async function loadSubscription(userId: string): Promise<Try<Subscription>> {
    const [user, userError] = await fx.runAsync(() => fetchUser(userId));
    if (userError != null) return fx.failure(userError);

    const [sub, subError] = await fx.runAsync(() => getSubscription(user.subscriptionId));
    if (subError != null) return fx.failure(subError);

    return fx.success(sub);
}

// Collecting results
const results = await Promise.all(ids.map((id) => fx.runAsync(() => fetchItem(id))));

// Fail on first error
const [items, error] = fx.flatten(results);

// Or keep only successes
const items = fx.filterFailures(results);
```

## Key Rules

- **One fallible operation per check.** Never batch multiple operations in a single `fx.runAsync` call.
- **Prefer original errors.** Only wrap in typed errors when callers need to distinguish failure kinds.
- **Always use `!= null`** to check the error element, never truthy/falsy checks.
- **Return `fx.success()` / `fx.failure()`** from functions with a `Try` return type.

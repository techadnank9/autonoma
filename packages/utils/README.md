# @autonoma/utils

Shared utility functions used across the Autonoma monorepo. This is a lightweight, dependency-free package that provides common helpers not specific to any single domain.

## Exports

### `toSlug(name: string): string`

Converts a string into a URL-friendly slug. Lowercases the input, replaces non-alphanumeric characters with dashes, and trims leading/trailing dashes.

```ts
import { toSlug } from "@autonoma/utils";

toSlug("Hello World!");                      // "hello-world"
toSlug("  Leading and trailing spaces  ");   // "leading-and-trailing-spaces"
toSlug("Special @#$%^&*() characters");      // "special-characters"
```

## Architecture Notes

- **ESM-only** - published as TypeScript source via `"exports": { ".": "./src/index.ts" }`. No build step required for consumers in the monorepo.
- **No runtime dependencies** - only dev dependencies (TypeScript, Vitest, etc.).
- **One export per file** - each utility lives in its own file and is re-exported from `src/index.ts`.
- Extends `tsconfig.base.json` with strictest TypeScript settings.

## Adding a New Utility

1. Create a new file in `src/` (e.g., `src/my-helper.ts`) with a single exported function.
2. Re-export it from `src/index.ts`.
3. Run `pnpm typecheck` to verify.

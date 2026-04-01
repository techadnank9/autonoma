import { join } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/**/*.test.ts"],
        env: {
            ...config({ path: join(__dirname, "../../.env") }).parsed,
            TESTING: "true",
            SENTRY_ENV: "test",
            NAMESPACE: "test",
        },
    },
});

import { join } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        globalSetup: ["./test/setup-fixtures.ts"],
        include: ["test/**/*.test.ts", ...(process.env.RUN_EVALS === "true" ? ["evals/**/*.eval.ts"] : [])],
        exclude: ["**/dist/**", "**/node_modules/**"],
        env: { ...config({ path: join(__dirname, "../../.env") }).parsed },
        watch: false,
    },
});

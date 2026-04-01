import { join } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        include: ["test/unit/**/*.test.ts"],
        env: { ...config({ path: join(__dirname, "../../.env") }).parsed, TESTING: "true" },
    },
});

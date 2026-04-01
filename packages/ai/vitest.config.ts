import { join } from "node:path";
import { config } from "dotenv";
import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        watch: false,
        env: { ...config({ path: join(__dirname, "../../.env") }).parsed },
    },
});

import { env as loggerEnv } from "@autonoma/logger/env";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const baseEnv = createEnv({
    extends: [loggerEnv],
    server: {
        SCENARIO_ENCRYPTION_KEY: z.string().min(1),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});

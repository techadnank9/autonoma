import { env as loggerEnv } from "@autonoma/logger/env";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    extends: [loggerEnv],
    server: {
        AUTO_ACTIVATE: z.string().optional(),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});

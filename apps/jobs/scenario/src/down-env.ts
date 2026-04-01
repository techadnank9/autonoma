import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { baseEnv } from "./base-env";

export const downEnv = createEnv({
    extends: [baseEnv],
    server: {
        SCENARIO_INSTANCE_ID: z.string().min(1),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});

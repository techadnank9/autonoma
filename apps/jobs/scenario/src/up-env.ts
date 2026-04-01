import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";
import { baseEnv } from "./base-env";

export const upEnv = createEnv({
    extends: [baseEnv],
    server: {
        SCENARIO_JOB_TYPE: z.enum(["run", "generation"]),
        ENTITY_ID: z.string().min(1),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
});

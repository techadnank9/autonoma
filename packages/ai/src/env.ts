import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        GROQ_KEY: z.string().min(1),
        GEMINI_API_KEY: z.string().min(1),
        OPENROUTER_API_KEY: z.string().min(1),
    },
    runtimeEnv: process.env,
    emptyStringAsUndefined: true,
    skipValidation: process.env["VITEST"] != null,
});

import z from "zod";

export interface RefreshCommandSpec {
    interaction: "refresh";
    params: Record<string, never>;
    output: { outcome: string; url: string };
}

export const refreshParamsSchema = z.object({}) satisfies z.ZodType<RefreshCommandSpec["params"]>;

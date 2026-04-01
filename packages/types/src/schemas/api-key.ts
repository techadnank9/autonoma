import { z } from "zod";

export const CreateApiKeyInputSchema = z.object({
    name: z.string().min(1).max(100),
});
export type CreateApiKeyInput = z.infer<typeof CreateApiKeyInputSchema>;

export const DeleteApiKeyInputSchema = z.object({
    keyId: z.string(),
});
export type DeleteApiKeyInput = z.infer<typeof DeleteApiKeyInputSchema>;

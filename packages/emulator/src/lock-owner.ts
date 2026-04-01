import { z } from "zod";

/**
 * Schema for lock owner components.
 * The lock owner format is: "userId:runId"
 * - userId: The user or organization ID (used interchangeably in the codebase)
 * - runId: The unique run/execution ID to prevent collisions between runs from the same user
 */
export const LockOwnerParamsSchema = z.object({
    userId: z.string().min(1, "userId must not be empty"),
    runId: z.string().min(1, "runId must not be empty"),
});

export type LockOwnerParams = z.infer<typeof LockOwnerParamsSchema>;

/**
 * Builds a lock owner string from components.
 * Format: "userId:runId"
 *
 * @example
 * buildLockOwner("org123", "run456") // => "org123:run456"
 * buildLockOwner({ userId: "org123", runId: "run456" }) // => "org123:run456"
 */
export function buildLockOwner(userId: string, runId: string): string;
export function buildLockOwner(params: LockOwnerParams): string;
export function buildLockOwner(userIdOrParams: string | LockOwnerParams, runId?: string): string {
    if (typeof userIdOrParams === "string") {
        if (runId == null) {
            throw new Error("runId is required when userId is provided as a string");
        }
        // Validate via schema (will catch empty strings)
        const validated = LockOwnerParamsSchema.parse({ userId: userIdOrParams, runId });
        return `${validated.userId}:${validated.runId}`;
    }

    // Object form
    const validated = LockOwnerParamsSchema.parse(userIdOrParams);
    return `${validated.userId}:${validated.runId}`;
}

/**
 * Parses a lock owner string back into its components.
 * Useful for debugging and extracting runId for logging.
 *
 * @example
 * parseLockOwner("org123:run456") // => { userId: "org123", runId: "run456" }
 */
export function parseLockOwner(owner: string): LockOwnerParams {
    const parts = owner.split(":");
    if (parts.length !== 2) {
        throw new Error(`Invalid lock owner format: "${owner}". Expected format: "userId:runId"`);
    }

    return LockOwnerParamsSchema.parse({
        userId: parts[0],
        runId: parts[1],
    });
}

/**
 * Type guard to check if a string is a valid lock owner format.
 */
export function isValidLockOwner(owner: string): boolean {
    try {
        parseLockOwner(owner);
        return true;
    } catch {
        return false;
    }
}

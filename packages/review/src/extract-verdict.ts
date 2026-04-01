import { logger } from "@autonoma/logger";
import type { ReviewVerdict } from "@autonoma/types";

export function extractVerdict(
    steps: ReadonlyArray<{ readonly toolCalls: ReadonlyArray<Record<string, unknown>> }>,
): ReviewVerdict | undefined {
    for (const step of steps) {
        for (const toolCall of step.toolCalls) {
            if (toolCall.toolName === "submit_verdict") {
                return toolCall.input as ReviewVerdict;
            }
        }
    }

    logger.warn("No submit_verdict tool call found - agent reached max steps without submitting");

    return undefined;
}

import type { LanguageModel } from "@autonoma/ai";
import { logger } from "@autonoma/logger";
import type { ReviewVerdict } from "@autonoma/types";
import type { ModelMessage, ToolSet } from "ai";
import { ToolLoopAgent, hasToolCall, stepCountIs } from "ai";
import { extractVerdict } from "./extract-verdict";

const MAX_REVIEW_STEPS = 15;

export interface ReviewAgentResult {
    verdict: ReviewVerdict | undefined;
}

export async function runReviewAgent(
    model: LanguageModel,
    systemPrompt: string,
    tools: ToolSet,
    messages: ModelMessage[],
): Promise<ReviewAgentResult> {
    const agent = new ToolLoopAgent({
        model,
        instructions: systemPrompt,
        tools,
        stopWhen: [hasToolCall("submit_verdict"), stepCountIs(MAX_REVIEW_STEPS)],
        onStepFinish: (step) => {
            logger.info("Reviewer step finished", {
                finishReason: step.finishReason,
                toolCalls: step.toolCalls.map((tc) => tc.toolName),
                inputTokens: step.usage.inputTokens,
                outputTokens: step.usage.outputTokens,
            });
        },
    });

    const result = await agent.generate({ messages });
    const verdict = extractVerdict(result.steps);

    return { verdict };
}

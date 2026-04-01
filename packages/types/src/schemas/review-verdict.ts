import { z } from "zod";

export const reviewVerdictSchema = z.object({
    verdict: z.enum(["agent_error", "application_bug"]).describe("The root cause classification of the failure"),
    confidence: z.number().int().min(0).max(100).describe("How confident you are in this classification (0-100%)"),
    severity: z.enum(["critical", "high", "medium", "low"]).describe("The severity of the issue found"),
    title: z.string().describe("Short summary of the issue, like a bug report title (under 100 chars)"),
    reasoning: z.string().describe("Detailed explanation of why this verdict was chosen"),
    failurePoint: z.object({
        stepOrder: z.number().optional().describe("The step where the failure occurred, if identifiable"),
        description: z.string().describe("What happened at the point of failure"),
    }),
    evidence: z
        .array(
            z.object({
                type: z.enum(["conversation", "screenshot", "video", "step_output"]),
                description: z.string(),
                s3Key: z.string().optional().describe("S3 key for the associated media asset (screenshot or video)"),
            }),
        )
        .describe("Evidence supporting the verdict"),
});

export type ReviewVerdict = z.infer<typeof reviewVerdictSchema>;

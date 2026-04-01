import { tool } from "ai";
import { z } from "zod";
import type { GeneratedTest } from "./add-test-tool";
import type { BugReport } from "./bug-found-tool";
import type { ModifyTestInput } from "./modify-test-tool";
import type { QuarantineTestInput } from "./quarantine-test-tool";
import type { SkillUpdate } from "./update-skill-tool";

export type TestAction = ({ type: "modify" } & ModifyTestInput) | ({ type: "quarantine" } & QuarantineTestInput);

export interface DiffsAgentResult {
    skillUpdates: SkillUpdate[];
    testActions: TestAction[];
    bugReports: BugReport[];
    newTests: GeneratedTest[];
    reasoning: string;
}

export type ResultCollector = Omit<DiffsAgentResult, "reasoning">;

const finishSchema = z.object({
    reasoning: z.string().describe("Overall summary of the analysis: what was found, what actions were taken, and why"),
});

export function buildFinishTool(onFinish: (result: DiffsAgentResult) => void, collector: ResultCollector) {
    return tool({
        description:
            "Call this tool when you have finished analyzing the diff. " +
            "Provide your overall reasoning and summary. " +
            "All actions (run_test, quarantine_test, bug_found, modify_test, update_skill, add_test) " +
            "should have been called BEFORE calling finish.",
        inputSchema: finishSchema,
        execute: ({ reasoning }) => onFinish({ ...collector, reasoning }),
    });
}

import { type ArgoDagData, DagBuilder, argoTemplates } from "../../k8s/argo";
import type { ArgoTemplateData } from "../../k8s/argo/templates/template";
import { generationReviewerTemplate } from "../generation-reviewer/generation-reviewer-template";
import { scenarioDownTemplate } from "../scenario/scenario-down.template";
import { scenarioUpTemplate } from "../scenario/scenario-up.template";
import { billingNotifyTemplate } from "./billing-notify.template";
import { executionAgentMobileTemplate } from "./mobile/execution-agent-mobile";
import { executionAgentWebTemplate } from "./web/execution-agent-web";

export type WorkflowArchitecture = "WEB" | "IOS" | "ANDROID";

export interface TestPlanItem {
    testGenerationId: string;
    scenarioId?: string;
}

export type ExecutionTemplate = ArgoTemplateData<{ testGenerationId: string }>;

const GENERATION_DAG_INPUTS = {
    testGenerationId: "test-generation-id",
    scenarioId: "scenario-id",
} as const;

export async function resolveExecutionTemplate(architecture: WorkflowArchitecture): Promise<ExecutionTemplate> {
    return architecture === "WEB" ? executionAgentWebTemplate() : executionAgentMobileTemplate();
}

export async function buildGenerationDag(executionTemplate: ExecutionTemplate) {
    const dag = new DagBuilder("test-generation-workflow", GENERATION_DAG_INPUTS);

    const [upTemplate, downTemplate, notifyTemplate, reviewTemplate] = await Promise.all([
        scenarioUpTemplate(),
        scenarioDownTemplate(),
        billingNotifyTemplate(),
        generationReviewerTemplate(),
    ]);

    const runExecution = dag.addTemplate(executionTemplate);
    const scenarioUp = dag.addTemplate(upTemplate);
    const scenarioDown = dag.addTemplate(downTemplate);
    const notifyGenerationExit = dag.addTemplate(notifyTemplate);
    const reviewGeneration = dag.addTemplate(reviewTemplate);

    const scenarioUpTask = dag.addTask({
        name: "scenario-up",
        template: scenarioUp,
        args: {
            scenarioJobType: "generation",
            entityId: dag.input("testGenerationId"),
            scenarioId: dag.input("scenarioId"),
        },
        when: `'${dag.input("scenarioId")}' != ''`,
    });

    const runGeneration = dag.addTask({
        name: "run-generation",
        template: runExecution,
        args: { testGenerationId: dag.input("testGenerationId") },
        depends: `${scenarioUpTask.succeeded} || ${scenarioUpTask.skipped}`,
    });

    dag.addTask({
        name: "notify-generation-exit",
        template: notifyGenerationExit,
        args: { testGenerationId: dag.input("testGenerationId") },
        depends: runGeneration.completed,
    });

    dag.addTask({
        name: "scenario-down",
        template: scenarioDown,
        args: {
            scenarioInstanceId: scenarioUpTask.output("scenarioInstanceId"),
        },
        depends: runGeneration.completed,
        when: `'${dag.input("scenarioId")}' != ''`,
    });

    dag.addTask({
        name: "review-generation",
        template: reviewGeneration,
        args: { generationId: dag.input("testGenerationId") },
        depends: runGeneration.completed,
    });

    return dag.build();
}

export async function testPlanDags(
    testPlans: TestPlanItem[],
    architecture: WorkflowArchitecture,
): Promise<ArgoDagData> {
    const executionTemplate = await resolveExecutionTemplate(architecture);

    const mainDag = new DagBuilder("main", {});
    const generateTest = mainDag.addTemplate(argoTemplates.dag(await buildGenerationDag(executionTemplate)));

    for (const [i, testPlan] of testPlans.entries()) {
        mainDag.addTask({
            name: `test-plan-${i}`,
            template: generateTest,
            args: {
                testGenerationId: testPlan.testGenerationId,
                scenarioId: testPlan.scenarioId ?? "",
            },
        });
    }

    return mainDag.build();
}

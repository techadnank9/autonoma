import { logger } from "@autonoma/logger";
import { DagBuilder, argoTemplates } from "../k8s/argo";
import { getK8sClient, type ArgoWorkflowRef } from "../k8s/k8s-client";
import { generationAssignerTemplate } from "./generation-assigner/generation-assigner-template";
import {
    type TestPlanItem,
    type WorkflowArchitecture,
    buildGenerationDag,
    resolveExecutionTemplate,
} from "./generation/test-plan-dag";

export interface TriggerBatchGenerationParams {
    testPlans: TestPlanItem[];
    agentVersion: string;
    architecture: WorkflowArchitecture;
    autoActivate?: boolean;
}

/**
 * Creates a single Argo workflow that runs all generation execution agents
 * in parallel, then runs the generation-assigner job to assign results.
 *
 * Workflow structure:
 *   test-gen-0 (scenario-up -> run-generation -> scenario-down) \
 *   test-gen-1 (scenario-up -> run-generation -> scenario-down)  |-> assign-results
 *   ...                                                         /
 */
export async function triggerBatchGeneration(params: TriggerBatchGenerationParams): Promise<void> {
    const { testPlans, agentVersion, architecture, autoActivate } = params;

    const testGenerationIds = testPlans.map((tp) => tp.testGenerationId);
    logger.info("Building batch generation workflow", { testGenerationIds, architecture });

    const executionTemplate = await resolveExecutionTemplate(architecture);
    const generationDag = await buildGenerationDag(executionTemplate);
    const assignerTemplateData = await generationAssignerTemplate();

    const mainDag = new DagBuilder("main", {});
    const generateTest = mainDag.addTemplate(argoTemplates.dag(generationDag));
    const assignerRef = mainDag.addTemplate(assignerTemplateData);

    const generationTasks = testPlans.map((testPlan, i) =>
        mainDag.addTask({
            name: `test-gen-${i}`,
            template: generateTest,
            args: {
                testGenerationId: testPlan.testGenerationId,
                scenarioId: testPlan.scenarioId ?? "",
            },
        }),
    );

    const allCompleted = generationTasks.map((t) => `(${t.completed})`).join(" && ");

    mainDag.addTask({
        name: "assign-results",
        template: assignerRef,
        args: {
            generationIds: testGenerationIds.join(" "),
            activate: autoActivate != null ? String(autoActivate) : "false",
        },
        depends: allCompleted,
    });

    const dagData = mainDag.build();
    const k8s = getK8sClient();

    logger.info("Creating batch generation workflow", {
        testGenerationIds,
        templateCount: dagData.templateDefinitions.length,
    });

    const labels: Record<string, string> = { "agent-version": agentVersion };
    for (const testPlan of testPlans) {
        labels[`gen-${testPlan.testGenerationId}`] = "true";
    }

    await k8s.createWorkflow({
        name: "batch-generations",
        labels,
        dagData,
    });

    logger.info("Batch generation workflow created", { testGenerationIds });
}

export async function findLatestWorkflowByGenerationId(generationId: string): Promise<ArgoWorkflowRef | undefined> {
    const k8s = getK8sClient();
    const [byLegacyLabel, byPerGenLabel] = await Promise.all([
        k8s.queryWorkflows(`generation-id=${generationId}`),
        k8s.queryWorkflows(`gen-${generationId}=true`),
    ]);
    const items = [...byLegacyLabel, ...byPerGenLabel];

    const latest = items
        .filter((item) => item.metadata?.name != null && item.metadata?.uid != null)
        .sort((a, b) => {
            const aTime = Date.parse(a.metadata?.creationTimestamp ?? "");
            const bTime = Date.parse(b.metadata?.creationTimestamp ?? "");
            return bTime - aTime;
        })[0];

    if (latest?.metadata?.name == null || latest.metadata.uid == null) {
        return undefined;
    }

    return {
        name: latest.metadata.name,
        uid: latest.metadata.uid,
    };
}

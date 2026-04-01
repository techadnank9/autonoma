import { logger } from "@autonoma/logger";
import { DagBuilder } from "../../k8s/argo";
import { getK8sClient } from "../../k8s/k8s-client";
import { diffsTemplate } from "./diffs-template";

export interface TriggerDiffsJobParams {
    branchId: string;
}

export async function triggerDiffsJob(params: TriggerDiffsJobParams): Promise<void> {
    const { branchId } = params;

    logger.info("Creating Argo workflow for diffs analysis", { branchId });

    const dag = new DagBuilder("main", {});
    const template = dag.addTemplate(await diffsTemplate());

    dag.addTask({
        name: "analyze",
        template,
        args: { branchId },
    });

    const k8s = getK8sClient();
    await k8s.createWorkflow({
        name: "diffs-analysis",
        labels: { "branch-id": branchId },
        dagData: dag.build(),
    });

    logger.info("Argo workflow for diffs analysis created successfully", { branchId });
}

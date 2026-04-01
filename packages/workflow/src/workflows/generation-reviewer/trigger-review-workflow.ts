import { logger } from "@autonoma/logger";
import { DagBuilder } from "../../k8s/argo";
import { getK8sClient } from "../../k8s/k8s-client";
import { generationReviewerTemplate } from "./generation-reviewer-template";

export async function triggerGenerationReviewWorkflow(generationId: string): Promise<void> {
    logger.info("Creating Argo workflow for generation review", { generationId });

    const dag = new DagBuilder("main", {});
    const template = dag.addTemplate(await generationReviewerTemplate());

    dag.addTask({
        name: "review",
        template,
        args: { generationId },
    });

    const k8s = getK8sClient();
    await k8s.createWorkflow({
        name: "generation-review",
        labels: { "generation-id": generationId },
        dagData: dag.build(),
    });

    logger.info("Argo workflow for generation review created successfully", { generationId });
}

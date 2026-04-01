import { logger } from "@autonoma/logger";
import { DagBuilder } from "../../k8s/argo";
import { getK8sClient } from "../../k8s/k8s-client";
import { replayReviewerTemplate } from "./replay-reviewer-template";

export async function triggerReplayReviewWorkflow(runId: string): Promise<void> {
    logger.info("Creating Argo workflow for replay review", { runId });

    const dag = new DagBuilder("main", {});
    const template = dag.addTemplate(await replayReviewerTemplate());

    dag.addTask({
        name: "review",
        template,
        args: { runId },
    });

    const k8s = getK8sClient();
    await k8s.createWorkflow({
        name: "replay-review",
        labels: { "run-id": runId },
        dagData: dag.build(),
    });

    logger.info("Argo workflow for replay review created successfully", { runId });
}

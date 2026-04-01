import { TemplateInput, argoTemplates } from "../../k8s/argo";
import { imageContainer } from "../../k8s/container";
import { job } from "../../k8s/job";

const APP = "generation-reviewer";
const JOB_TYPE = "generation-reviewer";

const INPUTS = {
    generationId: new TemplateInput("generation-id"),
};

export async function generationReviewerTemplate() {
    const container = await imageContainer({
        name: "generation-reviewer",
        imageKey: "generation-reviewer",
        secretFile: "generation-reviewer-file",
        command: ["node", "dist/index.js"],
        args: [`${INPUTS.generationId}`],
        resources: { requests: { cpu: "100m", memory: "256Mi" }, limits: { cpu: "500m", memory: "1Gi" } },
    });

    return argoTemplates.job({
        name: "review-generation",
        inputs: INPUTS,
        job: job({
            app: APP,
            type: JOB_TYPE,
            extraLabels: {},
            spec: {
                backoffLimit: 0,
                ttlSecondsAfterFinished: 60 * 15,
                template: {
                    metadata: { labels: { app: APP, type: JOB_TYPE } },
                    spec: {
                        restartPolicy: "Never",
                        containers: [container],
                    },
                },
            },
        }),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "argo",
    });
}

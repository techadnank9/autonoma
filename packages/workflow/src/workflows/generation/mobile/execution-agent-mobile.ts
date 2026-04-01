import type { V1Job } from "@kubernetes/client-node";
import { TemplateInput, argoTemplates } from "../../../k8s/argo";
import { imageContainer } from "../../../k8s/container";
import { job } from "../../../k8s/job";

const APP = "agent-generation-mobile";
const JOB_TYPE = "test-plan-generation-mobile";

function executionAgentMobileContainer(testGenerationId: string) {
    return imageContainer({
        name: "execution-agent-mobile",
        imageKey: "execution-agent-mobile",
        secretFile: "execution-agent-file",
        command: ["node", "dist/index.js"],
        args: [testGenerationId],
        resources: { limits: { cpu: "1500m" }, requests: { cpu: "1500m" } },
    });
}

function extraLabels(testGenerationId: string) {
    return { "test-generation-id": testGenerationId };
}

export async function executionAgentMobileJob(testGenerationId: string): Promise<V1Job> {
    const labels = {
        app: APP,
        type: JOB_TYPE,
        ...extraLabels(testGenerationId),
    };

    return job({
        app: APP,
        type: JOB_TYPE,
        extraLabels: extraLabels(testGenerationId),
        spec: {
            backoffLimit: 0,
            ttlSecondsAfterFinished: 60 * 15,
            template: {
                metadata: { labels },
                spec: {
                    restartPolicy: "Never",
                    nodeSelector: { pool: "mobile-worker" },
                    tolerations: [{ key: "pool", operator: "Equal", value: "mobile-worker", effect: "NoSchedule" }],
                    containers: [await executionAgentMobileContainer(testGenerationId)],
                },
            },
        },
    });
}

const INPUTS = { testGenerationId: new TemplateInput("test-generation-id") };

export async function executionAgentMobileTemplate() {
    return argoTemplates.job({
        name: "run-generation-mobile",
        inputs: INPUTS,
        job: await executionAgentMobileJob(`${INPUTS.testGenerationId}`),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "mobile",
    });
}

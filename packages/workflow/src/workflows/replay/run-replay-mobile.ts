import type { V1Job } from "@kubernetes/client-node";
import { argoTemplates, TemplateInput } from "../../k8s/argo";
import { imageContainer } from "../../k8s/container";
import { job } from "../../k8s/job";

const APP = "agent-replay-mobile";
const JOB_TYPE = "run-replay-mobile";

function runReplayMobileContainer(runId: string) {
    return imageContainer({
        name: "replay-agent",
        imageKey: "execution-agent-mobile",
        secretFile: "execution-agent-file",
        command: ["node", "dist/replay-job.js"],
        args: [runId],
        resources: { limits: { cpu: "1500m" }, requests: { cpu: "1500m" } },
        volumeMounts: [{ name: "flag", mountPath: "/tmp/flag" }],
    });
}

export async function runReplayMobileJob(runId: string): Promise<V1Job> {
    const extraLabels = { "run-id": runId };

    return job({
        app: APP,
        type: JOB_TYPE,
        extraLabels,
        spec: {
            backoffLimit: 0,
            ttlSecondsAfterFinished: 60 * 15,
            template: {
                metadata: {
                    labels: { app: APP, type: JOB_TYPE, ...extraLabels },
                },
                spec: {
                    restartPolicy: "Never",
                    nodeSelector: { pool: "mobile-worker" },
                    tolerations: [{ key: "pool", operator: "Equal", value: "mobile-worker", effect: "NoSchedule" }],
                    containers: [await runReplayMobileContainer(runId)],
                    volumes: [{ name: "flag", emptyDir: {} }],
                },
            },
        },
    });
}

const INPUTS = { runId: new TemplateInput("run-id") };

export async function runReplayMobileTemplate() {
    return argoTemplates.job({
        name: "run-replay-mobile",
        inputs: INPUTS,
        job: await runReplayMobileJob(`${INPUTS.runId}`),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "mobile",
    });
}

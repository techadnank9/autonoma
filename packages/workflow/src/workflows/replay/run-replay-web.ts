import type { V1Job } from "@kubernetes/client-node";
import { argoJobTemplate } from "../../k8s/argo/templates/job-template";
import { TemplateInput } from "../../k8s/argo/templates/template";
import { imageContainer } from "../../k8s/container";
import { job } from "../../k8s/job";
import { browserContainer } from "../common/browser-container";

const RUN_REPLAY_APP = "agent-replay";
const RUN_REPLAY_JOB_TYPE = "run-replay";

function runReplayWebContainer(runId: string) {
    return imageContainer({
        name: "replay-agent",
        imageKey: "execution-agent-web",
        secretFile: "execution-agent-file",
        command: ["tsx", "src/replay/run-replay-job.ts"],
        args: [runId],
        resources: { limits: { cpu: "1500m" }, requests: { cpu: "1500m" } },
        env: [{ name: "REMOTE_BROWSER_URL", value: "127.0.0.1:3000" }],
        volumeMounts: [
            { name: "dshm", mountPath: "/dev/shm" },
            { name: "flag", mountPath: "/tmp/flag" },
        ],
    });
}

export async function runReplayWebJob(runId: string): Promise<V1Job> {
    const extraLabels = { "run-id": runId };

    return job({
        app: RUN_REPLAY_APP,
        type: RUN_REPLAY_JOB_TYPE,
        extraLabels,
        spec: {
            backoffLimit: 0,
            ttlSecondsAfterFinished: 60 * 15,
            template: {
                metadata: {
                    labels: { app: RUN_REPLAY_APP, type: RUN_REPLAY_JOB_TYPE, ...extraLabels },
                },
                spec: {
                    restartPolicy: "Never",
                    nodeSelector: { pool: "web-worker" },
                    tolerations: [{ key: "pool", operator: "Equal", value: "web-worker", effect: "NoSchedule" }],
                    volumes: [
                        { name: "dshm", emptyDir: { medium: "Memory", sizeLimit: "8Gi" } },
                        { name: "flag", emptyDir: {} },
                    ],
                    containers: await Promise.all([runReplayWebContainer(runId), browserContainer()]),
                },
            },
        },
    });
}

const INPUTS = { runId: new TemplateInput("run-id") };

export async function runReplayWebTemplate() {
    return argoJobTemplate({
        name: "run-replay-web",
        inputs: INPUTS,
        job: await runReplayWebJob(`${INPUTS.runId}`),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "web",
    });
}

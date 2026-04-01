import type { V1Job } from "@kubernetes/client-node";
import { TemplateInput, argoTemplates } from "../../../k8s/argo";
import { imageContainer } from "../../../k8s/container";
import { job } from "../../../k8s/job";
import { browserContainer } from "../../common/browser-container";

const EXECUTION_AGENT_APP = "agent-generation";
const EXECUTION_AGENT_JOB_TYPE = "test-plan-generation";

function executionAgentWebContainer(testGenerationId: string) {
    return imageContainer({
        name: "execution-agent-web",
        imageKey: "execution-agent-web",
        secretFile: "execution-agent-file",
        command: ["tsx", "src/execution-agent/generation-api/run-generation-job.ts"],
        args: [testGenerationId],
        resources: { limits: { cpu: "1500m" }, requests: { cpu: "1500m" } },
        env: [{ name: "REMOTE_BROWSER_URL", value: "127.0.0.1:3000" }],
        volumeMounts: [
            { name: "dshm", mountPath: "/dev/shm" },
            { name: "flag", mountPath: "/tmp/flag" },
        ],
    });
}

export async function executionAgentWebJob(testGenerationId: string): Promise<V1Job> {
    const labels = {
        app: EXECUTION_AGENT_APP,
        type: EXECUTION_AGENT_JOB_TYPE,
        ...executionAgentExtraLabels(testGenerationId),
    };

    return job({
        app: EXECUTION_AGENT_APP,
        type: EXECUTION_AGENT_JOB_TYPE,
        extraLabels: executionAgentExtraLabels(testGenerationId),
        spec: {
            backoffLimit: 0,
            ttlSecondsAfterFinished: 60 * 15,
            template: {
                metadata: { labels },
                spec: {
                    restartPolicy: "Never",
                    nodeSelector: { pool: "web-worker" },
                    tolerations: [{ key: "pool", operator: "Equal", value: "web-worker", effect: "NoSchedule" }],
                    volumes: [
                        { name: "dshm", emptyDir: { medium: "Memory", sizeLimit: "8Gi" } },
                        { name: "flag", emptyDir: {} },
                    ],
                    containers: await Promise.all([executionAgentWebContainer(testGenerationId), browserContainer()]),
                },
            },
        },
    });
}

function executionAgentExtraLabels(testGenerationId: string) {
    return { "test-generation-id": testGenerationId };
}

const INPUTS = { testGenerationId: new TemplateInput("test-generation-id") };

export async function executionAgentWebTemplate() {
    return argoTemplates.job({
        name: "run-generation-web",
        inputs: INPUTS,
        job: await executionAgentWebJob(`${INPUTS.testGenerationId}`),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "web",
    });
}

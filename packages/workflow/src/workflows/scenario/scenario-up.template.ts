import { TemplateInput, argoTemplates } from "../../k8s/argo";
import { imageContainer } from "../../k8s/container";

const INPUTS = {
    scenarioJobType: new TemplateInput("scenario-job-type"),
    entityId: new TemplateInput("entity-id"),
    scenarioId: new TemplateInput("scenario-id"),
};

const OUTPUTS = {
    scenarioInstanceId: {
        name: "scenario-instance-id" as const,
        valueFrom: { path: "/tmp/scenario-instance-id", default: "" },
    },
};

export async function scenarioUpTemplate() {
    return argoTemplates.container({
        name: "scenario-up",
        inputs: INPUTS,
        outputs: OUTPUTS,
        container: await imageContainer({
            name: "scenario-up",
            imageKey: "workflow-scenario",
            secretFile: "scenario-manager-file",
            command: ["node", "dist/up.js"],
            env: [
                { name: "SCENARIO_JOB_TYPE", value: `${INPUTS.scenarioJobType}` },
                { name: "ENTITY_ID", value: `${INPUTS.entityId}` },
            ],
            resources: {
                requests: { cpu: "100m", memory: "256Mi" },
                limits: { cpu: "500m", memory: "1Gi" },
            },
        }),
        retryStrategy: { limit: 2, backoff: { duration: "30s", factor: 2 } },
    });
}

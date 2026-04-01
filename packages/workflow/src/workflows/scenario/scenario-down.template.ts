import { TemplateInput, argoTemplates } from "../../k8s/argo";
import { imageContainer } from "../../k8s/container";

const INPUTS = {
    scenarioInstanceId: new TemplateInput("scenario-instance-id"),
};

export async function scenarioDownTemplate() {
    return argoTemplates.container({
        name: "scenario-down",
        inputs: INPUTS,
        outputs: {},
        container: await imageContainer({
            name: "scenario-down",
            imageKey: "workflow-scenario",
            secretFile: "scenario-manager-file",
            command: ["node", "dist/down.js"],
            env: [{ name: "SCENARIO_INSTANCE_ID", value: `${INPUTS.scenarioInstanceId}` }],
            resources: {
                requests: { cpu: "100m", memory: "256Mi" },
                limits: { cpu: "500m", memory: "1Gi" },
            },
        }),
        retryStrategy: { limit: 5, backoff: { duration: "30s", factor: 2 } },
    });
}

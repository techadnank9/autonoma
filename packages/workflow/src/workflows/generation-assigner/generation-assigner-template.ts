import { TemplateInput, argoTemplates } from "../../k8s/argo";
import { imageContainer } from "../../k8s/container";

const INPUTS = {
    generationIds: new TemplateInput("generation-ids"),
    activate: new TemplateInput("activate"),
};

export async function generationAssignerTemplate() {
    return argoTemplates.container({
        name: "assign-generation-results",
        inputs: INPUTS,
        outputs: {},
        container: await imageContainer({
            name: "generation-assigner",
            imageKey: "generation-assigner",
            secretFile: "generation-assigner-file",
            command: ["node", "dist/index.js"],
            args: [`${INPUTS.generationIds}`],
            env: [{ name: "AUTO_ACTIVATE", value: `${INPUTS.activate}` }],
            resources: { requests: { cpu: "100m", memory: "256Mi" }, limits: { cpu: "500m", memory: "1Gi" } },
        }),
    });
}

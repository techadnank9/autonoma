import { TemplateInput, argoTemplates } from "../../k8s/argo";
import { diffsJob } from "./diffs-job";

const INPUTS = {
    branchId: new TemplateInput("branch-id"),
};

export async function diffsTemplate() {
    return argoTemplates.job({
        name: "diffs-analysis",
        inputs: INPUTS,
        job: await diffsJob(`${INPUTS.branchId}`),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "argo",
    });
}

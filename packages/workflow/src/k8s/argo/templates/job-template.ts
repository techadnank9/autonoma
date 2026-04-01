import type { V1Job } from "@kubernetes/client-node";
import type { JobNamespace } from "../../job-namespaces";
import type { ArgoResourceTemplate } from "../argo-types";
import { type ArgoTemplateData, type TemplateInputs, argoTemplate } from "./template";

export interface ArgoJobParams<TInputs extends Record<string, string>> {
    name: string;
    inputs: TemplateInputs<TInputs>;
    job: V1Job;
    successCondition: string;
    failureCondition: string;
    namespace: JobNamespace;
}

/**
 * Build an Argo template from a job spec and parameters.
 *
 * Tasks using this template will create a Kubernetes job based on the provided job spec.
 */
export function argoJobTemplate<TInputs extends Record<string, string>>({
    name,
    inputs,
    job,
    successCondition,
    failureCondition,
    namespace,
}: ArgoJobParams<TInputs>): ArgoTemplateData<TInputs, Record<string, never>, ArgoResourceTemplate> {
    const manifest = {
        ...job,
        metadata: { ...job.metadata, namespace },
    };

    return argoTemplate({
        name,
        inputs,
        // Job templates don't support outputs
        outputs: {},
        templateSpec: {
            resource: {
                action: "create",
                manifest: JSON.stringify(manifest),
                successCondition,
                failureCondition,
            },
        },
    });
}

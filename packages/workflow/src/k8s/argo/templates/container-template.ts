import type { V1Container } from "@kubernetes/client-node";
import type { ArgoContainerTemplate, ArgoRetryStrategy } from "../argo-types";
import { type ArgoTemplateData, type TemplateInputs, argoTemplate } from "./template";

interface ArgoContainerParams<TInputs extends Record<string, string>, TOutputs extends Record<string, string>> {
    name: string;
    inputs: TemplateInputs<TInputs>;
    outputs: { [K in keyof TOutputs]: { name: TOutputs[K]; valueFrom: { path: string; default?: string } } };
    container: V1Container;
    retryStrategy?: ArgoRetryStrategy;
}

/**
 * Build an Argo container template from a container spec and parameters.
 *
 * This type of job may have outputs that are referenced by other tasks in the same workflow.
 */
export function argoContainerTemplate<TInputs extends Record<string, string>, TOutputs extends Record<string, string>>({
    name,
    inputs,
    outputs,
    container,
    retryStrategy,
}: ArgoContainerParams<TInputs, TOutputs>): ArgoTemplateData<TInputs, TOutputs, ArgoContainerTemplate> {
    return argoTemplate({
        name,
        inputs,
        outputs: Object.fromEntries(Object.entries(outputs).map(([key, { name }]) => [key, name])) as TOutputs,
        templateSpec: {
            container,
            retryStrategy,
            outputs: { parameters: Object.values(outputs) },
        },
    });
}

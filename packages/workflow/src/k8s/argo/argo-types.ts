/**
 * Type definitions for the JSON objects expected by the Argo workflow engine.
 *
 * These are defined manually because they aren't available in the `@kubernetes-models/argo-workflows` package.
 * Expect them to be incomplete and only cover the fields that we actually use in our workflows. Update them as needed.
 */

import type { V1Container } from "@kubernetes/client-node";

export interface ArgoInputSpec {
    name: string;
}

export interface ArgoOutputSpec {
    name: string;
    valueFrom: {
        path: string;
        default?: string;
    };
}

export interface ArgoRetryStrategy {
    limit: number;
    backoff?: {
        duration: string;
        factor: number;
    };
}

export interface ArgoTemplate {
    name: string;
    inputs: {
        parameters: ArgoInputSpec[];
    };
    outputs?: {
        parameters: ArgoOutputSpec[];
    };
}

export interface ArgoResourceTemplate extends ArgoTemplate {
    resource: {
        action: string;
        manifest: string;
        successCondition: string;
        failureCondition: string;
    };
}

export interface ArgoContainerTemplate extends ArgoTemplate {
    container: V1Container;
    retryStrategy?: ArgoRetryStrategy;
}

export interface ArgoDagTask {
    name: string;
    template: string;
    depends?: string;
    when?: string;
    arguments?: {
        parameters: Array<{ name: string; value: string }>;
    };
}

export interface ArgoDagTemplate extends ArgoTemplate {
    dag: {
        tasks: ArgoDagTask[];
    };
}

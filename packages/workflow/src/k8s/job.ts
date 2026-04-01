import type { V1Job, V1JobSpec } from "@kubernetes/client-node";

export interface JobBuilderParams {
    app: string;
    type: string;
    extraLabels: Record<string, string>;
    spec: V1JobSpec;
}

/** Build a V1Job with standardized metadata. */
export function job({ app, type, extraLabels, spec }: JobBuilderParams): V1Job {
    return {
        apiVersion: "batch/v1",
        kind: "Job",
        metadata: {
            generateName: `${type}-`,
            labels: { app, type, ...extraLabels },
        },
        spec,
    };
}

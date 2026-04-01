import { imageContainer } from "../../k8s/container";
import { job } from "../../k8s/job";

const APP = "diffs";
const JOB_TYPE = "diffs-analysis";

export async function diffsJob(branchId: string) {
    return job({
        app: APP,
        type: JOB_TYPE,
        extraLabels: { "branch-id": branchId },
        spec: {
            backoffLimit: 0,
            ttlSecondsAfterFinished: 3600,
            template: {
                metadata: {
                    labels: { app: APP, type: JOB_TYPE, "branch-id": branchId },
                },
                spec: {
                    restartPolicy: "Never",
                    volumes: [
                        {
                            name: "repo-data",
                            emptyDir: { sizeLimit: "100Gi" },
                        },
                    ],
                    containers: [
                        {
                            ...(await imageContainer({
                                name: APP,
                                imageKey: "diffs",
                                secretFile: "diffs-env-file",
                                env: [{ name: "BRANCH_ID", value: branchId }],
                            })),
                            volumeMounts: [{ name: "repo-data", mountPath: "/tmp/repo" }],
                        },
                    ],
                },
            },
        },
    });
}

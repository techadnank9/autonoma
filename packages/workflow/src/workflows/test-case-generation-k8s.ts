import { logger } from "@autonoma/logger";
import { DagBuilder, TemplateInput, argoTemplates } from "../k8s/argo";
import { imageContainer } from "../k8s/container";
import { job } from "../k8s/job";
import { getK8sClient } from "../k8s/k8s-client";

const APP = "test-case-generator";
const JOB_TYPE = "test-case-generation";

const INPUTS = { repositoryId: new TemplateInput("repository-id") };

async function testCaseGenerationJob(repositoryId: string) {
    return job({
        app: APP,
        type: JOB_TYPE,
        extraLabels: { "repository-id": repositoryId },
        spec: {
            backoffLimit: 0,
            ttlSecondsAfterFinished: 3600,
            template: {
                metadata: {
                    labels: { app: APP, type: JOB_TYPE, "repository-id": repositoryId },
                },
                spec: {
                    restartPolicy: "Never",
                    containers: [
                        await imageContainer({
                            name: APP,
                            imageKey: "test-case-generator",
                            secretFile: "test-case-generator-env-file",
                            env: [{ name: "REPOSITORY_ID", value: repositoryId }],
                        }),
                    ],
                },
            },
        },
    });
}

async function testCaseGenerationTemplate() {
    return argoTemplates.job({
        name: "test-case-generation",
        inputs: INPUTS,
        job: await testCaseGenerationJob(`${INPUTS.repositoryId}`),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "argo",
    });
}

export async function triggerTestCaseGenerationJob(repositoryId: string): Promise<void> {
    logger.info("Creating Argo workflow for test case generation", { repositoryId });

    const dag = new DagBuilder("main", {});
    const template = dag.addTemplate(await testCaseGenerationTemplate());

    dag.addTask({
        name: "generate",
        template,
        args: { repositoryId },
    });

    const k8s = getK8sClient();
    await k8s.createWorkflow({
        name: "test-case-generation",
        labels: { "repository-id": repositoryId },
        dagData: dag.build(),
    });

    logger.info("Argo workflow for test case generation created successfully", { repositoryId });
}

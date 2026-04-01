---
name: workflow-builders
description: Builder abstraction layer for constructing K8s Jobs, Argo workflow templates, and DAGs in the `packages/workflow` package. Load when developing Argo workflows.
---

# Workflow Builder Pattern for Argo Workflows

## Architecture

The workflow package uses a functional builder pattern to construct K8s and Argo objects. The layers are:

```
DagBuilder (k8s/argo/dag-builder.ts)            - orchestrates tasks referencing templates
  └── Argo Templates (k8s/argo/templates/)
        ├── argoContainerTemplate()              - runs a container in the workflow pod
        ├── argoJobTemplate()                    - creates a K8s Job and watches it
        └── argoDagTemplate()                    - wraps a DagBuilder result as a nested DAG
              └── K8s Job (k8s/job.ts)
                    └── Containers (k8s/container.ts)
```

## Directory Structure

```
packages/workflow/src/
├── k8s/
│   ├── argo/
│   │   ├── argo-types.ts           - Argo JSON type definitions
│   │   ├── dag-builder.ts          - DagBuilder, TaskHandle, TemplateRef, ArgoDagData
│   │   ├── templates/
│   │   │   ├── template.ts         - TemplateInput, argoTemplate (base), ArgoTemplateData
│   │   │   ├── container-template.ts
│   │   │   ├── job-template.ts
│   │   │   ├── dag-template.ts
│   │   │   ├── argo-templates.ts   - argoTemplates barrel object
│   │   │   └── index.ts
│   │   └── index.ts                - barrel re-export
│   ├── container.ts                - imageContainer() - resolves image from ConfigMap
│   ├── job.ts                      - job() - standardized V1Job builder
│   ├── image-keys.ts               - ImageKey, SecretFileName, image version config schema
│   ├── job-namespaces.ts           - JobNamespace type ("web" | "mobile" | "argo")
│   └── k8s-client.ts              - K8sClient with createWorkflow, queryWorkflows
├── workflows/                      - workflow definitions (review this directory for examples)
├── env.ts
└── index.ts                        - package exports
```

## Type System

All Argo types live in `k8s/argo/argo-types.ts`:

- `ArgoInputSpec` - `{ name: string }` - input parameter declaration
- `ArgoOutputSpec` - `{ name: string, valueFrom: { path, default? } }` - output declaration
- `ArgoRetryStrategy` - `{ limit, backoff?: { duration, factor } }`
- `ArgoTemplate` - base with `name`, `inputs`, optional `outputs`
- `ArgoContainerTemplate`, `ArgoResourceTemplate`, `ArgoDagTemplate` - extend `ArgoTemplate`
- `ArgoDagTask` - `{ name, template, depends?, when?, arguments? }`

## TemplateInput (`k8s/argo/templates/template.ts`)

Wraps an Argo parameter name. Uses `toString()` for interpolation in template literals:

```ts
const input = new TemplateInput("test-generation-id");
`${input}` // "{{inputs.parameters.test-generation-id}}"
```

`TemplateInputs<TInputs>` maps friendly camelCase keys to `TemplateInput` instances:

```ts
type TemplateInputs<TInputs extends Record<string, string>> = {
    [K in keyof TInputs]: TemplateInput<TInputs[K]>;
};
```

## ArgoTemplateData

All template builders return `ArgoTemplateData<TInputs, TOutputs, TTemplateSpec>`:

```ts
interface ArgoTemplateData<TInputs, TOutputs, TTemplateSpec> {
    inputs: TInputs;       // friendly-name -> argo-name mapping
    outputs: TOutputs;     // friendly-name -> argo-name mapping
    templateSpec: TTemplateSpec;
    childTemplates?: ArgoTemplate[];  // nested templates (for DAGs)
}
```

The `TInputs`/`TOutputs` types use friendly camelCase keys mapping to Argo kebab-case names. For example: `{ testGenerationId: "test-generation-id" }`.

## Template Builders

### `argoContainerTemplate(params)`

Builds a container template. Inputs are provided as `TemplateInput` instances:

```ts
const INPUTS = {
    scenarioJobType: new TemplateInput("scenario-job-type"),
    entityId: new TemplateInput("entity-id"),
    scenarioId: new TemplateInput("scenario-id"),
};

export async function scenarioUpTemplate() {
    return argoContainerTemplate({
        name: "scenario-up",
        inputs: INPUTS,
        outputs: {
            scenarioInstanceId: {
                name: "scenario-instance-id",
                valueFrom: { path: "/tmp/scenario-instance-id", default: "" },
            },
        },
        container: await imageContainer({
            name: "scenario-up",
            imageKey: "workflow-scenario",
            secretFile: "scenario-manager-file",
            command: ["node", "dist/up.js"],
            env: [
                { name: "SCENARIO_JOB_TYPE", value: `${INPUTS.scenarioJobType}` },
                { name: "ENTITY_ID", value: `${INPUTS.entityId}` },
            ],
        }),
        retryStrategy: { limit: 2, backoff: { duration: "30s", factor: 2 } },
    });
}
```

### `argoJobTemplate(params)`

Builds a resource template that creates a K8s Job. Requires a `namespace` parameter (`JobNamespace`):

```ts
export async function executionAgentWebTemplate() {
    return argoJobTemplate({
        name: "run-generation-web",
        inputs: { testGenerationId: new TemplateInput("test-generation-id") },
        job: await executionAgentWebJob(`${INPUTS.testGenerationId}`),
        successCondition: "status.succeeded > 0",
        failureCondition: "status.failed > 0",
        namespace: "web",
    });
}
```

### `argoDagTemplate(dagBuildResult)`

Wraps a `DagBuilder.build()` result as an `ArgoTemplateData` for nesting in a parent DAG.

## DagBuilder (`k8s/argo/dag-builder.ts`)

Mutable accumulator that builds a typed DAG template.

### Key Types

```ts
interface TemplateRef<TInputs, TOutputs> {
    readonly templateName: string;
    readonly _inputs: TInputs;
    readonly _outputs: TOutputs;
}

interface ArgoDagData<TInputs extends Record<string, string>> {
    entrypoint: string;
    dagTemplate: ArgoDagTemplate;
    templateDefinitions: ArgoTemplate[];
    inputs: TInputs;
}
```

### `TaskHandle<TOutputs>`

Returned by `addTask()`. Provides:
- `output(key)` - type-safe output reference: `{{tasks.<name>.outputs.parameters.<param>}}`
- `succeeded` / `failed` / `errored` / `skipped` - dependency condition strings
- `completed` - shorthand for `Succeeded || Failed || Errored`

### Usage

```ts
const dag = new DagBuilder("my-workflow", {
    testGenerationId: "test-generation-id",
    scenarioId: "scenario-id",
} as const);

// Register a template and get a typed reference
const runRef = dag.addTemplate(executionTemplate);

// Add tasks with typed args and dependency expressions
const scenarioUp = dag.addTask({
    name: "scenario-up",
    template: scenarioUpRef,
    args: {
        entityId: dag.input("testGenerationId"),
        scenarioId: dag.input("scenarioId"),
    },
    when: `${dag.input("scenarioId")} != ''`,
});

const run = dag.addTask({
    name: "run-generation",
    template: runRef,
    args: { testGenerationId: dag.input("testGenerationId") },
    depends: `${scenarioUp.succeeded} || ${scenarioUp.skipped}`,
});

dag.addTask({
    name: "scenario-down",
    template: scenarioDownRef,
    args: { scenarioInstanceId: scenarioUp.output("scenarioInstanceId") },
    depends: run.completed,
    when: `${dag.input("scenarioId")} != ''`,
});

const result = dag.build();  // ArgoDagData
```

## K8s Helpers

### `imageContainer(params)` (`k8s/container.ts`)

Builds a `V1Container` for Docker image-based containers. Resolves the image from a K8s ConfigMap, mounts secrets, and injects shared environment variables (`SENTRY_ENV`, `DATABASE_URL`):

```ts
await imageContainer({
    name: "scenario-up",
    imageKey: "workflow-scenario",   // ImageKey - see k8s/image-keys.ts
    secretFile: "scenario-manager-file",  // SecretFileName - see k8s/image-keys.ts
    command: ["node", "dist/up.js"],
    env: [{ name: "ENTITY_ID", value: `${INPUTS.entityId}` }],
});
```

Check `k8s/image-keys.ts` for the current `ImageKey` and `SecretFileName` union types.

### `job(params)` (`k8s/job.ts`)

Builds a `V1Job` with standardized metadata and labels:

```ts
job({
    app: "execution-agent-web",
    type: "run-generation-web",
    extraLabels: { "test-generation-id": testGenerationId },
    spec: { ... },
});
```

### `K8sClient` (`k8s/k8s-client.ts`)

Singleton client (accessed via `getK8sClient()`) providing:
- `static fromEnv()` - creates client from environment
- `getImage(imageKey)` - resolves image from ConfigMap
- `createWorkflow({ name, labels, dagData })` - creates Argo workflow from `ArgoDagData`
- `queryWorkflows(labelSelector)` - queries workflows by label

## How to Add a New Template

1. Create a template function in the appropriate `workflows/` subdirectory
2. Use `argoContainerTemplate()` or `argoJobTemplate()` with `TemplateInput` instances
3. Wire it into the DAG using `dag.addTemplate()` and `dag.addTask()`
4. If adding a new image, add the key to `k8s/image-keys.ts`

## Key Conventions

- Everything is functions, no abstract classes
- Use `TemplateInput` for type-safe Argo parameter interpolation via `toString()`
- `TInputs`/`TOutputs` use camelCase keys mapping to kebab-case Argo names
- Container/job functions take plain `string` parameters (interpolation happens via `TemplateInput.toString()`)
- `DagBuilder.addTemplate()` deduplicates child templates automatically
- Workflow creation goes through `K8sClient.createWorkflow()`, not raw API calls
- Job templates require a `namespace` parameter (`JobNamespace`) for targeting the correct K8s namespace

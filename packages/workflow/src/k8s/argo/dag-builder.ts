import type { ArgoDagTask, ArgoDagTemplate, ArgoTemplate } from "./argo-types";
import type { ArgoTemplateData } from "./templates/template";

// ---- TemplateRef ----

export interface TemplateRef<
    TInputs extends Record<string, string> = Record<string, string>,
    TOutputs extends Record<string, string> = Record<string, string>,
> {
    readonly templateName: string;
    readonly _inputs: TInputs;
    readonly _outputs: TOutputs;
}

// ---- TaskHandle ----

export class TaskHandle<TOutputs extends Record<string, string> = Record<string, string>> {
    constructor(
        public readonly name: string,
        private readonly outputs: TOutputs,
    ) {}

    output<K extends keyof TOutputs>(key: K) {
        return `{{tasks.${this.name}.outputs.parameters.${this.outputs[key]}}}`;
    }

    get succeeded() {
        return `${this.name}.Succeeded`;
    }

    get failed() {
        return `${this.name}.Failed`;
    }

    get errored() {
        return `${this.name}.Errored`;
    }

    get skipped() {
        return `${this.name}.Skipped`;
    }

    get completed() {
        return `${this.name}.Succeeded || ${this.name}.Failed || ${this.name}.Errored`;
    }
}

// ---- DagBuilder ----

interface AddTaskSpec<TInputs extends Record<string, string>, TOutputs extends Record<string, string>> {
    name: string;
    template: TemplateRef<TInputs, TOutputs>;
    args: { [K in keyof TInputs]: string };
    when?: string;
    depends?: string;
}

export interface ArgoDagData<TInputs extends Record<string, string> = Record<string, string>> {
    entrypoint: string;
    dagTemplate: ArgoDagTemplate;
    templateDefinitions: ArgoTemplate[];
    inputs: TInputs;
}

export class DagBuilder<TInputs extends Record<string, string>> {
    private readonly tasks: ArgoDagTask[] = [];
    private readonly templateSpecs: ArgoTemplate[] = [];

    constructor(
        private readonly name: string,
        private readonly inputs: TInputs,
    ) {}

    input<K extends keyof TInputs>(key: K): string {
        return `{{inputs.parameters.${this.inputs[key]}}}`;
    }

    addTemplate<TI extends Record<string, string>, TO extends Record<string, string>>({
        templateSpec,
        inputs,
        outputs,
        childTemplates,
    }: ArgoTemplateData<TI, TO, ArgoTemplate>): TemplateRef<TI, TO> {
        this.templateSpecs.push(templateSpec);

        if (childTemplates != null)
            this.templateSpecs.push(
                // Only add child templates that are not already in the template specs
                ...childTemplates.filter((child) => !this.templateSpecs.map((spec) => spec.name).includes(child.name)),
            );

        return {
            templateName: templateSpec.name,
            _inputs: inputs,
            _outputs: outputs,
        };
    }

    addTask<TI extends Record<string, string>, TO extends Record<string, string>>({
        name,
        template,
        args,
        when,
        depends,
    }: AddTaskSpec<TI, TO>): TaskHandle<TO> {
        const parameters = Object.entries(args).map(([key, value]) => ({
            name: template._inputs[key] as string,
            value,
        }));

        this.tasks.push({
            name: name,
            template: template.templateName,
            depends,
            when,
            arguments: parameters.length > 0 ? { parameters } : undefined,
        });

        return new TaskHandle(name, template._outputs);
    }

    build(): ArgoDagData<TInputs> {
        const dagTemplate: ArgoDagTemplate = {
            name: this.name,
            inputs: { parameters: Object.values(this.inputs).map((name) => ({ name })) },
            dag: { tasks: this.tasks },
        };

        return {
            entrypoint: this.name,
            dagTemplate,
            templateDefinitions: [dagTemplate, ...this.templateSpecs],
            inputs: this.inputs,
        };
    }
}

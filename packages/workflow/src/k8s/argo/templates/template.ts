import type { ArgoTemplate } from "../argo-types";

/**
 * Represents an input parameter for an Argo template.
 *
 * When interpolating this input in a template, it will be replaced by the `{{inputs.parameters.name}}` interpolation key.
 */
export class TemplateInput<const TName extends string = string> {
    constructor(readonly argoName: TName) {}

    toString(): string {
        return `{{inputs.parameters.${this.argoName}}}`;
    }
}

export type TemplateInputs<TInputs extends Record<string, string>> = {
    [K in keyof TInputs]: TemplateInput<TInputs[K]>;
};

export interface ArgoTemplateParams<
    TInputs extends Record<string, string>,
    TOutputs extends Record<string, string>,
    TTemplateSpec extends ArgoTemplate,
> {
    name: string;
    inputs: TemplateInputs<TInputs>;
    outputs: TOutputs;
    templateSpec: Omit<TTemplateSpec, "name" | "inputs">;
}

export interface ArgoTemplateData<
    TInputs extends Record<string, string>,
    TOutputs extends Record<string, string> = Record<string, never>,
    TTemplateSpec extends ArgoTemplate = ArgoTemplate,
> {
    inputs: TInputs;
    outputs: TOutputs;
    templateSpec: TTemplateSpec;
    /** Additional template definitions required by this template (e.g. child templates of a DAG). */
    childTemplates?: ArgoTemplate[];
}

/**
 * Construct an Argo template from a template spec and parameters.
 *
 * Don't use this function directly; use one of its wrappers instead:
 * - {@link argoContainerTemplate}
 * - {@link argoJobTemplate}
 * - {@link argoDagTemplate}
 */
export function argoTemplate<
    const TInputs extends Record<string, string>,
    const TOutputs extends Record<string, string>,
    TTemplateSpec extends ArgoTemplate,
>({
    name,
    inputs,
    outputs,
    templateSpec,
}: ArgoTemplateParams<TInputs, TOutputs, TTemplateSpec>): ArgoTemplateData<TInputs, TOutputs, TTemplateSpec> {
    return {
        inputs: Object.fromEntries(Object.entries(inputs).map(([key, input]) => [key, input.argoName])) as TInputs,
        outputs,
        // @ts-expect-error classic Omit<T, K> & { [K]: ... } error
        templateSpec: {
            name,
            inputs: { parameters: Object.entries(inputs).map(([, input]) => ({ name: input.argoName })) },
            ...templateSpec,
        },
    };
}

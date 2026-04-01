import type { ArgoDagTemplate } from "../argo-types";
import type { ArgoDagData } from "../dag-builder";
import type { ArgoTemplateData } from "./template";

/**
 * Build an Argo template from a DAG workflow, resulting from a {@link DagBuilder}.build() call.
 */
export function argoDagTemplate<TInputs extends Record<string, string>>(
    buildResult: ArgoDagData<TInputs>,
): ArgoTemplateData<TInputs, Record<string, never>, ArgoDagTemplate> {
    return {
        inputs: buildResult.inputs,
        // DAG templates don't support outputs
        outputs: {},
        templateSpec: buildResult.dagTemplate,
        childTemplates: buildResult.templateDefinitions.filter((t) => t !== buildResult.dagTemplate),
    };
}

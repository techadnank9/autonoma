import { argoContainerTemplate } from "./container-template";
import { argoDagTemplate } from "./dag-template";
import { argoJobTemplate } from "./job-template";

export const argoTemplates = {
    job: argoJobTemplate,
    container: argoContainerTemplate,
    dag: argoDagTemplate,
};

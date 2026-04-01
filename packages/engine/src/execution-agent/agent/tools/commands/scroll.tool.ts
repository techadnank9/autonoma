import { type ScrollCommandContext, type ScrollCommandSpec, scrollParamsSchema } from "../../../../commands";
import { CommandTool } from "../command-tool";

export class ScrollTool extends CommandTool<
    ScrollCommandSpec,
    ScrollCommandContext,
    // Max scrolls is not controlled by the agent.
    Omit<ScrollCommandSpec["params"], "maxScrolls">
> {
    protected inputSchema() {
        return scrollParamsSchema.omit({ maxScrolls: true });
    }

    description(): string {
        return `Perform a scroll action on the application. This tool has several parameters:
- \`elementDescription\`: A natural language description of the element to scroll on. Only needed if you want to scroll on a specific section of the page. If not provided, the scroll will be performed on the entire page.
- \`direction\`: The direction to scroll. Can be \`"up"\` or \`"down"\`.
- \`condition\`: A visual condition to check after each scroll. Scrolling stops when this condition is met.`;
    }

    protected async extractParams({ elementDescription, direction, condition }: ScrollCommandSpec["params"]) {
        return {
            elementDescription,
            direction,
            condition,
            maxScrolls: 10,
        };
    }
}

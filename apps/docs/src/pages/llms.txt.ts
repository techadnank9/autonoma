import type { APIRoute } from "astro";
import { getOrderedDocs, llmsPath } from "../lib/llms/docs-collection";

export const GET: APIRoute = async (context) => {
    const docs = await getOrderedDocs();
    const site = context.site?.toString().replace(/\/$/, "") ?? "";

    const segments = [
        "# Autonoma Docs",
        "> Documentation for Autonoma's agentic end-to-end testing platform.",
        `## Pages\n\n${docs
            .map((doc) => `- [${doc.title}](${site}${llmsPath(doc.slug)}): ${doc.description}`)
            .join("\n")}`,
        `## Documentation Sets\n\n- [Complete documentation](${site}/llms-full.txt): all pages concatenated into a single file`,
    ];

    return new Response(`${segments.join("\n\n")}\n`);
};

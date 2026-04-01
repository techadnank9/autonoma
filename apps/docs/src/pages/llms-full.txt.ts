import type { APIRoute } from "astro";
import { getOrderedDocs } from "../lib/llms/docs-collection";
import { entryToMarkdown } from "../lib/llms/entry-to-markdown";

export const GET: APIRoute = async (context) => {
    const docs = await getOrderedDocs();
    const segments: string[] = [];

    for (const doc of docs) {
        const docSegments = [`# ${doc.title}`];
        if (doc.description) docSegments.push(`> ${doc.description}`);
        docSegments.push(await entryToMarkdown(doc.entry, context));
        segments.push(docSegments.join("\n\n"));
    }

    const preamble = "<SYSTEM>This is the full developer documentation for Autonoma</SYSTEM>";
    return new Response(`${preamble}\n\n${segments.join("\n\n")}`);
};

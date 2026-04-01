import type { APIRoute, GetStaticPaths } from "astro";
import { getOrderedDocs, llmsPath, withNavigation } from "../../lib/llms/docs-collection";
import { entryToMarkdown } from "../../lib/llms/entry-to-markdown";

export const getStaticPaths: GetStaticPaths = async () => {
    const docs = await getOrderedDocs();
    const docsWithNav = withNavigation(docs);

    return docsWithNav.map((doc) => ({
        params: { slug: doc.slug === "" ? "index" : doc.slug },
        props: {
            title: doc.title,
            description: doc.description,
            entryId: doc.entry.id,
            previous: doc.previous,
            next: doc.next,
        },
    }));
};

export const GET: APIRoute = async (context) => {
    const { title, description, entryId, previous, next } = context.props as {
        title: string;
        description: string;
        entryId: string;
        previous?: { slug: string; title: string };
        next?: { slug: string; title: string };
    };

    const docs = await getOrderedDocs();
    const doc = docs.find((d) => d.entry.id === entryId);
    if (doc == null) return new Response("Not found", { status: 404 });

    const site = context.site?.toString().replace(/\/$/, "") ?? "";
    const content = await entryToMarkdown(doc.entry, context);

    const segments = [`# ${title}`];
    if (description) segments.push(`> ${description}`);
    segments.push(content);

    const nav: string[] = [];
    if (previous != null) {
        nav.push(`Previous: [${previous.title}](${site}${llmsPath(previous.slug)})`);
    }
    if (next != null) {
        nav.push(`Next: [${next.title}](${site}${llmsPath(next.slug)})`);
    }
    if (nav.length > 0) {
        segments.push(`---\n\n${nav.join("\n")}`);
    }

    return new Response(`${segments.join("\n\n")}\n`);
};

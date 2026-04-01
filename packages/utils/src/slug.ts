/**
 * Slugify a string
 *
 * Example:
 *  - "Hello World!" => "hello-world"
 *  - "  Leading and trailing spaces  " => "leading-and-trailing-spaces"
 *  - "Special @#$%^&*() characters" => "special-characters"
 */
export function toSlug(name: string): string {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}

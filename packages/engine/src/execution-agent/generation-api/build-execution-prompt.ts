export function buildExecutionPrompt(
    basePrompt: string,
    customInstructions?: string | null,
    credentials?: Record<string, string>,
): string {
    const parts: string[] = [];

    if (credentials != null && Object.keys(credentials).length > 0) {
        const credentialLines = Object.entries(credentials)
            .map(([key]) => `- ${key}: {{${key}}}`)
            .join("\n");

        parts.push(
            `Before starting the test, log in using the following credentials. When typing each value, use the variable reference shown — do not type the variable name literally, the system resolves it to the actual value at runtime:\n${credentialLines}`,
        );
    }

    parts.push(basePrompt.trimEnd());

    const normalizedInstructions = customInstructions?.trim();
    if (normalizedInstructions != null && normalizedInstructions.length > 0) {
        parts.push(`## Application-specific instructions

These instructions come from the application settings and apply to every run unless the test plan explicitly says otherwise.

${normalizedInstructions}`);
    }

    return parts.join("\n\n");
}

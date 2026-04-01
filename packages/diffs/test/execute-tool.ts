/**
 * Helper to call an AI SDK tool's execute function in tests.
 * Casts away the union with AsyncIterable since our tools always return plain objects.
 */
export async function executeTool<TOutput>(
    // biome-ignore lint/suspicious/noExplicitAny: test utility - bypassing AI SDK's complex tool types
    tool: { execute?: (...args: any[]) => any },
    input: unknown,
): Promise<TOutput> {
    const result = await tool.execute?.(input, { toolCallId: "test", messages: [] });
    return result as TOutput;
}

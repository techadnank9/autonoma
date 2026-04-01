import { describe, expect, it } from "vitest";
import { MemoryStore } from "./memory-store";
import { resolveVariables } from "./resolve-variables";

function storeWith(entries: Record<string, string>): MemoryStore {
    const store = new MemoryStore();
    for (const [key, value] of Object.entries(entries)) {
        store.set(key, value);
    }
    return store;
}

describe("resolveVariables", () => {
    it("should replace a single variable in a string", () => {
        const memory = storeWith({ orderId: "ORD-123" });
        expect(resolveVariables("{{orderId}}", memory)).toBe("ORD-123");
    });

    it("should replace multiple variables in a string", () => {
        const memory = storeWith({ first: "John", last: "Doe" });
        expect(resolveVariables("{{first}} {{last}}", memory)).toBe("John Doe");
    });

    it("should replace variables in object values", () => {
        const memory = storeWith({ orderId: "ORD-456" });
        const params = { description: "row with ID {{orderId}}", text: "{{orderId}}" };
        expect(resolveVariables(params, memory)).toEqual({
            description: "row with ID ORD-456",
            text: "ORD-456",
        });
    });

    it("should replace variables in nested objects", () => {
        const memory = storeWith({ name: "Test" });
        const params = { outer: { inner: "{{name}}" } };
        expect(resolveVariables(params, memory)).toEqual({
            outer: { inner: "Test" },
        });
    });

    it("should replace variables in arrays", () => {
        const memory = storeWith({ a: "1", b: "2" });
        expect(resolveVariables(["{{a}}", "{{b}}"], memory)).toEqual(["1", "2"]);
    });

    it("should leave non-template strings unchanged", () => {
        const memory = storeWith({ orderId: "ORD-123" });
        expect(resolveVariables("no templates here", memory)).toBe("no templates here");
    });

    it("should pass through non-string primitives unchanged", () => {
        const memory = storeWith({});
        expect(resolveVariables(42, memory)).toBe(42);
        expect(resolveVariables(true, memory)).toBe(true);
        expect(resolveVariables(undefined, memory)).toBeUndefined();
    });

    it("should handle mixed objects with templates and non-templates", () => {
        const memory = storeWith({ code: "ABC" });
        const params = { description: "enter {{code}}", overwrite: true, count: 5 };
        expect(resolveVariables(params, memory)).toEqual({
            description: "enter ABC",
            overwrite: true,
            count: 5,
        });
    });

    it("should throw for unresolved variables", () => {
        const memory = storeWith({});
        expect(() => resolveVariables("{{missing}}", memory)).toThrow();
    });

    it("should not mutate the original object", () => {
        const memory = storeWith({ x: "resolved" });
        const original = { text: "{{x}}" };
        const result = resolveVariables(original, memory);
        expect(result.text).toBe("resolved");
        expect(original.text).toBe("{{x}}");
    });

    it("should handle empty memory with no templates", () => {
        const memory = storeWith({});
        const params = { description: "click the button", text: "hello" };
        expect(resolveVariables(params, memory)).toEqual(params);
    });
});

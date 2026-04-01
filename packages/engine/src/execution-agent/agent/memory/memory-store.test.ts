import { describe, expect, it } from "vitest";
import { MemoryStore } from "./memory-store";

describe("MemoryStore", () => {
    it("should store and retrieve a value", () => {
        const store = new MemoryStore();
        store.set("orderId", "ORD-123");
        expect(store.get("orderId")).toBe("ORD-123");
    });

    it("should return undefined for missing keys", () => {
        const store = new MemoryStore();
        expect(store.get("missing")).toBeUndefined();
    });

    it("should check for key existence", () => {
        const store = new MemoryStore();
        store.set("key", "value");
        expect(store.has("key")).toBe(true);
        expect(store.has("missing")).toBe(false);
    });

    it("should return all entries as a plain object", () => {
        const store = new MemoryStore();
        store.set("a", "1");
        store.set("b", "2");
        expect(store.getAll()).toEqual({ a: "1", b: "2" });
    });

    it("should return an empty object when no entries exist", () => {
        const store = new MemoryStore();
        expect(store.getAll()).toEqual({});
    });

    it("should overwrite existing values", () => {
        const store = new MemoryStore();
        store.set("key", "first");
        store.set("key", "second");
        expect(store.get("key")).toBe("second");
        expect(store.size).toBe(1);
    });

    it("should track size correctly", () => {
        const store = new MemoryStore();
        expect(store.size).toBe(0);
        store.set("a", "1");
        expect(store.size).toBe(1);
        store.set("b", "2");
        expect(store.size).toBe(2);
    });

    it("should clear all entries", () => {
        const store = new MemoryStore();
        store.set("a", "1");
        store.set("b", "2");
        store.clear();
        expect(store.size).toBe(0);
        expect(store.getAll()).toEqual({});
    });
});

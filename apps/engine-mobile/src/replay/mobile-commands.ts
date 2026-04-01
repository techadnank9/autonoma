import {
    AssertChecker,
    AssertionSplitter,
    GeminiObjectDetector,
    ObjectPointDetector,
    VisualConditionChecker,
} from "@autonoma/ai";
import type { Command } from "@autonoma/engine";
import { AssertCommand, MobileClickCommand, ScrollCommand, TypeCommand } from "@autonoma/engine";
import type { EngineModelRegistry } from "@autonoma/engine";
import type { MobileContext } from "../platform";
import type { ReplayMobileCommandSpec } from "./mobile-command-spec";

/**
 * Create all mobile replay commands with their AI dependencies.
 *
 * The return type cast is intentional: each command carries its own specific TSpec/TContext,
 * but at runtime MobileContext satisfies every specific command context, so the cast is safe.
 */
export function createMobileCommands(models: EngineModelRegistry): Command<ReplayMobileCommandSpec, MobileContext>[] {
    const pointDetector = new ObjectPointDetector(
        new GeminiObjectDetector(models.getModel({ model: "smart-visual", tag: "point-detection" })),
    );
    const assertChecker = new AssertChecker(models.getModel({ model: "smart-visual", tag: "assert" }));
    const assertionSplitter = new AssertionSplitter(models.getModel({ model: "fast-text", tag: "assertion-splitter" }));
    const visualConditionChecker = new VisualConditionChecker({
        model: models.getModel({ model: "fast-visual", tag: "visual-condition-checker" }),
    });

    return [
        new MobileClickCommand(pointDetector),
        new TypeCommand(pointDetector),
        new AssertCommand(assertChecker, assertionSplitter),
        new ScrollCommand(pointDetector, visualConditionChecker),
    ] as unknown as Command<ReplayMobileCommandSpec, MobileContext>[];
}

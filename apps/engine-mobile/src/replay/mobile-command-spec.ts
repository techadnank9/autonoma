import type { AssertCommandSpec, ClickCommandSpec, ScrollCommandSpec, TypeCommandSpec } from "@autonoma/engine";

/** The possible commands that the mobile replay engine can execute. */
export type ReplayMobileCommandSpec = ClickCommandSpec | TypeCommandSpec | AssertCommandSpec | ScrollCommandSpec;

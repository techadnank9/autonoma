import type { ResultCollector } from "../src/tools/finish-tool";

export function createEmptyCollector(): ResultCollector {
    return {
        skillUpdates: [],
        testActions: [],
        bugReports: [],
        newTests: [],
    };
}

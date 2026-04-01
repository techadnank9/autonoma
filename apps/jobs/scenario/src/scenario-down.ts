import type { ScenarioManager } from "@autonoma/scenario";

export interface ScenarioDownParams {
    scenarioInstanceId: string;
}

export interface ScenarioDownDeps {
    manager: ScenarioManager;
}

export async function scenarioDown(params: ScenarioDownParams, deps: ScenarioDownDeps): Promise<void> {
    const { scenarioInstanceId } = params;
    const { manager } = deps;

    const instance = await manager.down(scenarioInstanceId);

    if (instance == null) {
        return;
    }

    if (instance.status === "DOWN_FAILED") {
        throw new Error(
            `Scenario down failed: instanceId=${instance.id}, lastError=${JSON.stringify(instance.lastError)}`,
        );
    }
}

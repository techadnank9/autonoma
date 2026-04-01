import { db } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import { EncryptionHelper, ScenarioManager } from "@autonoma/scenario";
import { scenarioDown } from "./scenario-down";
import { scenarioUp } from "./scenario-up";

const testGenerationId = process.argv[2];
const encryptionKey = process.env.SCENARIO_ENCRYPTION_KEY;

if (testGenerationId == null) {
    console.error("Usage: tsx src/test-scenario.ts <TEST_GENERATION_ID>");
    process.exit(1);
}

if (encryptionKey == null) {
    console.error("Missing SCENARIO_ENCRYPTION_KEY environment variable");
    process.exit(1);
}

const encryption = new EncryptionHelper(encryptionKey);
const manager = new ScenarioManager(db, encryption);

logger.info("--- Scenario UP ---", { testGenerationId });

let scenarioInstanceId: string | undefined;

try {
    await scenarioUp({ type: "generation", entityId: testGenerationId }, { db, manager });

    const generation = await db.testGeneration.findUniqueOrThrow({
        where: { id: testGenerationId },
        select: { scenarioInstanceId: true },
    });
    scenarioInstanceId = generation.scenarioInstanceId ?? undefined;

    logger.info("Scenario UP succeeded", { scenarioInstanceId });
} catch (error) {
    logger.fatal("Scenario UP failed", { error: error instanceof Error ? error.message : error });
    process.exit(1);
}

if (scenarioInstanceId == null) {
    logger.fatal("No scenario instance created");
    process.exit(1);
}

logger.info("--- Scenario DOWN ---", { scenarioInstanceId });

try {
    await scenarioDown({ scenarioInstanceId }, { manager });
    logger.info("Scenario DOWN succeeded");
} catch (error) {
    logger.fatal("Scenario DOWN failed", { error: error instanceof Error ? error.message : error });
    process.exit(1);
}

logger.info("--- Test complete ---");
process.exit(0);

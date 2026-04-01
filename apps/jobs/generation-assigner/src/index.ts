import { db } from "@autonoma/db";
import { logger, runWithSentry } from "@autonoma/logger";
import { TestSuiteUpdater } from "@autonoma/test-updates";
import { env } from "./env";

const generationIds = process.argv.slice(2);
if (generationIds.length === 0) {
    console.error("Usage: generation-assigner <generationId1> <generationId2> ...");
    process.exit(1);
}

async function main() {
    logger.info("Starting generation assigner", { generationIds });

    const firstGeneration = await db.testGeneration.findUniqueOrThrow({
        // biome-ignore lint/style/noNonNullAssertion: validated above
        where: { id: generationIds[0]! },
        select: { snapshot: { select: { branchId: true } } },
    });

    const branchId = firstGeneration.snapshot.branchId;
    logger.info("Resolved branch from generation", { branchId });

    const updater = await TestSuiteUpdater.continueUpdate({ db, branchId });
    const { assigned, failed } = await updater.assignGenerationResults(generationIds);
    logger.info("Generation results assigned", { assigned, failed });

    const autoActivate = env.AUTO_ACTIVATE === "true";
    if (autoActivate) {
        await updater.finalize();
        logger.info("Snapshot finalized");
    } else {
        logger.info("Skipping finalization (ACTIVATE=false)");
    }
}

await runWithSentry({ name: "generation-assigner", tags: { generationCount: String(generationIds.length) } }, () =>
    main(),
);

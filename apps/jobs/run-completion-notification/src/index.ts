import { logger } from "@autonoma/logger";
import * as Sentry from "@sentry/node";
import { handleGenerationExit } from "./handlers/generation-exit";
import { initializeSentry } from "./instrumentation";

initializeSentry();

const args = process.argv.slice(2);
const command = args[0];

if (command !== "generation-exit") {
    console.error("Usage: run-completion-notification generation-exit <generationId>");
    process.exit(1);
}

const generationIdArg = args[1];
if (generationIdArg == null) {
    console.error("Usage: run-completion-notification generation-exit <generationId>");
    process.exit(1);
}
const generationId: string = generationIdArg;

async function main() {
    logger.info("Starting run completion notification job", { command, generationId });
    await handleGenerationExit(generationId);
}

try {
    await Sentry.withScope(async (scope) => {
        scope.setTag("notification_command", command);
        scope.setTag("generation_id", generationId);
        await main();
    });
    process.exit(0);
} catch (error) {
    logger.error("Notification job failed", error, { command, generationId });
    Sentry.captureException(error);
    await Sentry.flush(2000);
    process.exit(1);
}

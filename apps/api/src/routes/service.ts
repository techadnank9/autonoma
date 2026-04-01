import { type Logger, logger } from "@autonoma/logger";

/**
 * A service contains the business logic for a specific feature.
 */
export class Service {
    protected readonly logger: Logger;

    constructor() {
        this.logger = logger.child({ name: this.constructor.name });
    }
}

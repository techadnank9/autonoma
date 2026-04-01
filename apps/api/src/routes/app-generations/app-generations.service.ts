import type { PrismaClient } from "@autonoma/db";
import { Service } from "../service";

export class ApplicationSetupsService extends Service {
    constructor(private readonly db: PrismaClient) {
        super();
    }

    async getLatest(organizationId: string, applicationId: string) {
        return await this.db.applicationSetup.findFirst({
            where: { applicationId, organizationId },
            orderBy: { createdAt: "desc" },
            include: {
                events: { orderBy: { createdAt: "asc" } },
            },
        });
    }

    async getById(setupId: string, organizationId: string) {
        return await this.db.applicationSetup.findFirst({
            where: { id: setupId, organizationId },
            include: {
                events: { orderBy: { createdAt: "asc" } },
            },
        });
    }
}

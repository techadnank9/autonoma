import type { PrismaClient } from "@autonoma/db";
import { Service } from "../service";

type OrgStatus = "pending" | "approved" | "rejected";

export class AuthService extends Service {
    constructor(private readonly db: PrismaClient) {
        super();
    }

    async getActiveOrg(activeOrgId: string): Promise<{ id: string; name: string; slug: string } | undefined> {
        this.logger.info("Getting active org", { activeOrgId });

        const org = await this.db.organization.findUnique({
            where: { id: activeOrgId },
            select: { id: true, name: true, slug: true },
        });

        return org ?? undefined;
    }

    async getOrgStatus(userId: string): Promise<OrgStatus | undefined> {
        this.logger.info("Getting org status", { userId });

        const membership = await this.db.member.findFirst({
            where: { userId },
            select: { organization: { select: { status: true } } },
        });

        if (membership == null) return "pending";

        return membership.organization.status;
    }
}

import type { PrismaClient } from "@autonoma/db";
import type { Auth } from "../../auth";
import { Service } from "../service";

type SessionPayload = {
    session: Record<string, unknown>;
    user: Record<string, unknown>;
};

export class AdminService extends Service {
    constructor(
        private readonly db: PrismaClient,
        private readonly auth: Auth,
    ) {
        super();
    }

    private async updateSessionOrgInRedis(sessionToken: string, orgId: string) {
        const ctx = await this.auth.$context;
        const raw = await ctx.secondaryStorage?.get(sessionToken);
        if (raw == null) return;

        const parsed = JSON.parse(raw as string) as SessionPayload;
        parsed.session.activeOrganizationId = orgId;
        const ttl = Math.floor((new Date(parsed.session.expiresAt as string).getTime() - Date.now()) / 1000);
        await ctx.secondaryStorage?.set(sessionToken, JSON.stringify(parsed), ttl);
    }

    async listOrganizations() {
        this.logger.info("Listing organizations");

        const orgs = await this.db.organization.findMany({
            include: {
                members: { select: { id: true } },
                applications: { select: { id: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        this.logger.info("Organizations listed", { count: orgs.length });

        return orgs.map((org) => ({
            id: org.id,
            name: org.name,
            slug: org.slug,
            createdAt: org.createdAt,
            memberCount: org.members.length,
            applicationCount: org.applications.length,
        }));
    }

    async listPendingOrgs() {
        this.logger.info("Listing pending organizations");

        const orgs = await this.db.organization.findMany({
            where: { status: "pending" },
            include: {
                members: { select: { id: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        this.logger.info("Pending organizations listed", { count: orgs.length });

        return orgs.map((org) => ({
            id: org.id,
            name: org.name,
            slug: org.slug,
            domain: org.domain,
            createdAt: org.createdAt,
            memberCount: org.members.length,
        }));
    }

    async approveOrg(orgId: string) {
        this.logger.info("Approving org", { orgId });

        await this.db.organization.update({
            where: { id: orgId },
            data: { status: "approved" },
        });

        const members = await this.db.member.findMany({
            where: { organizationId: orgId },
            select: { userId: true },
        });

        for (const { userId } of members) {
            const ctx = await this.auth.$context;
            const sessions = await ctx.internalAdapter.listSessions(userId);
            for (const session of sessions) {
                const s = session as typeof session & { activeOrganizationId?: string | null };
                if (s.activeOrganizationId == null) {
                    await this.updateSessionOrgInRedis(session.token, orgId);
                }
            }
        }

        this.logger.info("Org approved and sessions updated", { orgId, memberCount: members.length });
    }

    async rejectOrg(orgId: string) {
        this.logger.info("Rejecting org", { orgId });

        await this.db.organization.update({
            where: { id: orgId },
            data: { status: "rejected" },
        });

        this.logger.info("Org rejected", { orgId });
    }

    async createOrg(name: string, slug: string, domain: string) {
        this.logger.info("Creating organization", { name, slug, domain });

        const org = await this.db.organization.create({
            data: {
                name,
                slug,
                domain,
                status: "approved",
            },
        });

        this.logger.info("Organization created", { orgId: org.id });
        return { id: org.id };
    }

    async switchToOrg(userId: string, sessionToken: string, orgId: string) {
        this.logger.info("Admin switching to org", { userId, orgId });

        await this.db.member.upsert({
            where: { userId_organizationId: { userId, organizationId: orgId } },
            update: {},
            create: { userId, organizationId: orgId, role: "admin" },
        });

        await this.updateSessionOrgInRedis(sessionToken, orgId);

        this.logger.info("Admin switched to org", { userId, orgId });
    }
}

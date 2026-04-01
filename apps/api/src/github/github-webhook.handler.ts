import { logger } from "@autonoma/logger";
import * as Sentry from "@sentry/node";
import type { GitHubInstallationService } from "./github-installation.service";

export class GitHubWebhookHandler {
    constructor(private readonly service: GitHubInstallationService) {}

    async handleInstallationCreated(
        installationId: number,
        orgId: string,
        accountLogin: string,
        accountId: number,
        accountType: string,
    ): Promise<void> {
        logger.info("GitHub webhook: installation.created", { installationId, orgId });

        await this.service.handleInstallation(installationId, orgId, accountLogin, accountId, accountType);
    }

    async handleInstallationDeleted(installationId: number): Promise<void> {
        logger.info("GitHub webhook: installation.deleted", { installationId });

        await this.service.handleUninstall(installationId);
    }

    async handleInstallationSuspended(installationId: number): Promise<void> {
        logger.info("GitHub webhook: installation.suspend", { installationId });

        await this.service.handleSuspend(installationId);
    }

    handlePullRequest(action: string, prNumber: number, repoFullName: string): void {
        logger.info("GitHub webhook: pull_request event (future feature)", {
            action,
            prNumber,
            repo: repoFullName,
        });

        Sentry.addBreadcrumb({
            category: "github.webhook",
            message: `pull_request.${action}`,
            data: { prNumber, repo: repoFullName },
        });
    }

    handlePush(repoFullName: string, ref: string): void {
        logger.info("GitHub webhook: push event (future feature)", {
            repo: repoFullName,
            ref,
        });

        Sentry.addBreadcrumb({
            category: "github.webhook",
            message: "push",
            data: { repo: repoFullName, ref },
        });
    }
}

import { db } from "@autonoma/db";
import { logger } from "@autonoma/logger";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { z } from "zod";
import { verifyApiKeyAndGetContext } from "../application-setup/verify-api-key";
import { getGithubApp } from "./github-app";
import { GitHubInstallationService } from "./github-installation.service";
import { verifyInstallState } from "./github-state";
import { GitHubWebhookHandler } from "./github-webhook.handler";

const deploymentBodySchema = z.object({
    repo_full_name: z.string(),
    sha: z.string(),
    base_sha: z.string().optional(),
    environment: z.string(),
    url: z.string().optional(),
});

export const githubHttpRouter = new Hono();

githubHttpRouter.use("*", cors({ origin: "*" }));

githubHttpRouter.get("/callback", async (c) => {
    const appUrl = process.env.APP_URL ?? "http://localhost:3000";

    const installationId = Number(c.req.query("installation_id"));
    const setupAction = c.req.query("setup_action");
    const state = c.req.query("state");

    if (Number.isNaN(installationId) || setupAction !== "install") {
        return c.redirect(`${appUrl}?error=invalid_callback`);
    }

    const statePayload = state != null ? verifyInstallState(state) : undefined;
    if (statePayload == null) {
        logger.warn("GitHub callback: missing or invalid state", { installationId });
        return c.redirect(`${appUrl}?error=invalid_state`);
    }
    const { organizationId, returnPath } = statePayload;

    const githubService = new GitHubInstallationService(db);

    try {
        const githubApp = getGithubApp();
        const installationOctokit = await githubApp.getInstallationOctokit(installationId);
        const installationData = await installationOctokit.request("GET /app/installations/{installation_id}", {
            installation_id: installationId,
        });

        const account = installationData.data.account as { login?: string; id?: number; type?: string } | null;

        await githubService.handleInstallation(
            installationId,
            organizationId,
            account?.login ?? "unknown",
            account?.id ?? 0,
            account?.type ?? "Organization",
        );
    } catch (error) {
        logger.fatal("Failed to handle GitHub installation callback", error, { installationId });
        const errorBase = returnPath != null ? `${appUrl}${returnPath}` : appUrl;
        return c.redirect(`${errorBase}?error=install_failed`);
    }

    const successBase = returnPath != null ? `${appUrl}${returnPath}` : appUrl;
    return c.redirect(`${successBase}?connected=true`);
});

githubHttpRouter.post("/deployment", async (c) => {
    const rawKey = c.req.header("authorization")?.replace(/^Bearer\s+/i, "");
    if (rawKey == null) return c.json({ error: "Unauthorized" }, 401);

    const apiKeyCtx = await verifyApiKeyAndGetContext(db, c.req.header("authorization"));
    if (apiKeyCtx == null) {
        return c.json({ error: "Unauthorized" }, 401);
    }

    const parsed = deploymentBodySchema.safeParse(await c.req.json());
    if (!parsed.success) {
        return c.json({ error: "Invalid request body", details: parsed.error.flatten() }, 400);
    }
    const body = parsed.data;

    const userId = apiKeyCtx.userId;
    const member = await db.member.findFirst({ where: { userId }, select: { organizationId: true } });
    if (member == null) return c.json({ error: "No organization for this API key" }, 403);

    const githubService = new GitHubInstallationService(db);

    try {
        await githubService.handleDeploymentNotification(
            member.organizationId,
            body.repo_full_name,
            body.sha,
            body.base_sha,
            body.environment,
            body.url,
        );
    } catch (error) {
        logger.fatal("Failed to handle deployment notification", error, {
            repoFullName: body.repo_full_name,
            sha: body.sha,
            environment: body.environment,
        });
        return c.json({ error: "Failed to process deployment" }, 500);
    }

    return c.json({ ok: true });
});

githubHttpRouter.post("/webhook", async (c) => {
    const body = await c.req.text();
    const signature = c.req.header("x-hub-signature-256") ?? "";
    const event = c.req.header("x-github-event") ?? "";

    let githubApp: ReturnType<typeof getGithubApp>;
    try {
        githubApp = getGithubApp();
    } catch {
        logger.warn("GitHub App not configured - ignoring webhook");
        return c.json({ ok: true });
    }

    const isValid = await githubApp.webhooks.verify(body, signature);
    if (!isValid) {
        logger.warn("Invalid GitHub webhook signature");
        return c.json({ error: "Invalid signature" }, 401);
    }

    const githubService = new GitHubInstallationService(db);
    const webhookHandler = new GitHubWebhookHandler(githubService);

    try {
        const payload = JSON.parse(body) as Record<string, unknown>;

        if (event === "installation") {
            const action = payload.action as string;
            const installation = payload.installation as {
                id: number;
                account?: { login?: string; id?: number; type?: string };
            };

            if (action === "created") {
                // Installation is created via the callback URL (which has session context).
                // The webhook fires too but carries no org context, so we ignore it here.
                logger.info("GitHub webhook: installation.created (handled via callback)", {
                    installationId: installation.id,
                    account: installation.account?.login,
                });
            } else if (action === "deleted") {
                await webhookHandler.handleInstallationDeleted(installation.id);
            } else if (action === "suspend") {
                await webhookHandler.handleInstallationSuspended(installation.id);
            }
        } else if (event === "pull_request") {
            const action = payload.action as string;
            const pr = payload.pull_request as { number: number };
            const repo = payload.repository as { full_name: string };
            webhookHandler.handlePullRequest(action, pr.number, repo.full_name);
        } else if (event === "push") {
            const repo = payload.repository as { full_name: string };
            const ref = payload.ref as string;
            webhookHandler.handlePush(repo.full_name, ref);
        }
    } catch (error) {
        logger.fatal("Error processing GitHub webhook", error, { event });
    }

    return c.json({ ok: true });
});

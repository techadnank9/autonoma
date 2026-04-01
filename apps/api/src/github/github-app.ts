import { App } from "@octokit/app";

let _githubApp: App | undefined;

export function getGithubApp(): App {
    if (_githubApp != null) return _githubApp;

    const appId = process.env.GITHUB_APP_ID;
    const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;
    const webhookSecret = process.env.GITHUB_APP_WEBHOOK_SECRET;

    if (appId == null || privateKey == null || webhookSecret == null) {
        throw new Error(
            "Missing required GitHub App environment variables: GITHUB_APP_ID, GITHUB_APP_PRIVATE_KEY, GITHUB_APP_WEBHOOK_SECRET",
        );
    }

    _githubApp = new App({
        appId,
        privateKey,
        webhooks: { secret: webhookSecret },
    });

    return _githubApp;
}

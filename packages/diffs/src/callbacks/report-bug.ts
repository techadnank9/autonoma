import { logger } from "@autonoma/logger";
import type { App } from "@octokit/app";
import type { BugReport } from "../tools/bug-found-tool";

export type InstallationOctokit = Awaited<ReturnType<App["getInstallationOctokit"]>>;

interface ReportBugDeps {
    repoFullName: string;
    headSha: string;
    octokit: InstallationOctokit;
}

export async function reportBug(report: BugReport, { repoFullName, headSha, octokit }: ReportBugDeps): Promise<void> {
    logger.info("Reporting bug", { summary: report.summary, repo: repoFullName });

    const [owner, repo] = repoFullName.split("/");
    if (owner == null || repo == null) {
        logger.error("Invalid repo full name", { repoFullName });
        return;
    }

    const body = formatBugIssueBody(report, headSha);

    const { data: issue } = await octokit.request("POST /repos/{owner}/{repo}/issues", {
        owner,
        repo,
        title: `[Autonoma] Bug detected: ${report.summary}`,
        body,
        labels: ["autonoma", "bug"],
    });

    logger.info("GitHub issue created", { issueNumber: issue.number, issueUrl: issue.html_url });
}

function formatBugIssueBody(report: BugReport, headSha: string): string {
    return `## Bug Report (Automated)

**Detected by Autonoma's diff analysis agent on commit \`${headSha.slice(0, 8)}\`.**

### Summary
${report.summary}

### Detailed Explanation
${report.detailedExplanation}

### Test Case
- **Slug:** \`${report.slug}\`
- **Test Name:** ${report.testName}

### Affected Files
${report.affectedFiles.map((f) => `- \`${f}\``).join("\n")}

### Suggested Fix
\`\`\`
${report.fixPrompt}
\`\`\`

---
*This issue was automatically created by [Autonoma](https://autonoma.app).*`;
}

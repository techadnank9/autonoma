import { describe, expect, it, vi } from "vitest";
import type { InstallationOctokit } from "../../src/callbacks/report-bug";
import type { BugReport } from "../../src/tools/bug-found-tool";

const bugReport: BugReport = {
    slug: "checkout-flow",
    testName: "Checkout flow",
    summary: "Payment button is unresponsive",
    detailedExplanation: "The payment button does not respond to clicks after form submission.",
    affectedFiles: ["src/components/PaymentButton.tsx"],
    fixPrompt: "Check the onClick handler in PaymentButton.tsx",
};

describe("reportBug", () => {
    it("creates a GitHub issue with the bug report", async () => {
        const { reportBug } = await import("../../src/callbacks/report-bug");

        const mockOctokit = {
            request: vi.fn().mockResolvedValue({
                data: { number: 42, html_url: "https://github.com/org/repo/issues/42" },
            }),
        } as unknown as InstallationOctokit;

        await reportBug(bugReport, {
            repoFullName: "org/repo",
            headSha: "abc12345def",
            octokit: mockOctokit,
        });

        expect(mockOctokit.request).toHaveBeenCalledWith(
            "POST /repos/{owner}/{repo}/issues",
            expect.objectContaining({
                owner: "org",
                repo: "repo",
                title: "[Autonoma] Bug detected: Payment button is unresponsive",
                labels: ["autonoma", "bug"],
            }),
        );
    });
});

import { z } from "zod";

export const GitHubInstallationStatusSchema = z.enum(["active", "suspended", "deleted"]);
export type GitHubInstallationStatus = z.infer<typeof GitHubInstallationStatusSchema>;

export const GitHubIndexingStatusSchema = z.enum(["pending", "running", "completed", "failed"]);
export type GitHubIndexingStatus = z.infer<typeof GitHubIndexingStatusSchema>;

export const GitHubDeploymentTriggerSchema = z.enum(["push", "github_action"]);
export type GitHubDeploymentTrigger = z.infer<typeof GitHubDeploymentTriggerSchema>;

export const GithubInstallationSchema = z.object({
    id: z.string(),
    installationId: z.number(),
    organizationId: z.string(),
    accountLogin: z.string(),
    accountId: z.number(),
    accountType: z.string(),
    status: GitHubInstallationStatusSchema,
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type GithubInstallation = z.infer<typeof GithubInstallationSchema>;

export const GithubRepositorySchema = z.object({
    id: z.string(),
    installationId: z.string(),
    githubRepoId: z.number(),
    name: z.string(),
    fullName: z.string(),
    defaultBranch: z.string(),
    private: z.boolean(),
    indexingStatus: GitHubIndexingStatusSchema,
    indexedAt: z.date().optional(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type GithubRepository = z.infer<typeof GithubRepositorySchema>;

export const GithubTestCaseSchema = z.object({
    id: z.string(),
    repositoryId: z.string(),
    name: z.string(),
    plan: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});
export type GithubTestCase = z.infer<typeof GithubTestCaseSchema>;

export const GithubRepoWithTestCasesSchema = GithubRepositorySchema.extend({
    testCases: z.array(GithubTestCaseSchema),
});
export type GithubRepoWithTestCases = z.infer<typeof GithubRepoWithTestCasesSchema>;

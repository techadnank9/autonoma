-- RenameEnum
ALTER TYPE "ApplicationArchitecture" RENAME TO "application_architecture";

-- RenameEnum
ALTER TYPE "OrganizationStatus" RENAME TO "organization_status";

-- RenameEnum
ALTER TYPE "GenerationStatus" RENAME TO "generation_status";

-- RenameTable: User -> user
ALTER TABLE "User" RENAME TO "user";

-- RenameTable: Session -> session
ALTER TABLE "Session" RENAME TO "session";

-- RenameTable: Account -> account
ALTER TABLE "Account" RENAME TO "account";

-- RenameTable: Verification -> verification
ALTER TABLE "Verification" RENAME TO "verification";

-- RenameTable: Organization -> organization
ALTER TABLE "Organization" RENAME TO "organization";

-- RenameTable: Member -> member
ALTER TABLE "Member" RENAME TO "member";

-- RenameTable: Invitation -> invitation
ALTER TABLE "Invitation" RENAME TO "invitation";

-- RenameTable: ApiKey -> api_key
ALTER TABLE "ApiKey" RENAME TO "api_key";

-- RenameTable: Application -> application
ALTER TABLE "Application" RENAME TO "application";

-- RenameTable: WebApplicationData -> web_application_data
ALTER TABLE "WebApplicationData" RENAME TO "web_application_data";

-- RenameTable: MobileApplicationData -> mobile_application_data
ALTER TABLE "MobileApplicationData" RENAME TO "mobile_application_data";

-- RenameTable: TestPlan -> test_plan
ALTER TABLE "TestPlan" RENAME TO "test_plan";

-- RenameTable: TestGeneration -> test_generation
ALTER TABLE "TestGeneration" RENAME TO "test_generation";

-- RenameColumns: user
ALTER TABLE "user" RENAME COLUMN "emailVerified" TO "email_verified";
ALTER TABLE "user" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "user" RENAME COLUMN "updatedAt" TO "updated_at";

-- RenameColumns: session
ALTER TABLE "session" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "session" RENAME COLUMN "ipAddress" TO "ip_address";
ALTER TABLE "session" RENAME COLUMN "userAgent" TO "user_agent";
ALTER TABLE "session" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "session" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "session" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "session" RENAME COLUMN "activeOrganizationId" TO "active_organization_id";

-- RenameColumns: account
ALTER TABLE "account" RENAME COLUMN "accountId" TO "account_id";
ALTER TABLE "account" RENAME COLUMN "providerId" TO "provider_id";
ALTER TABLE "account" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "account" RENAME COLUMN "accessToken" TO "access_token";
ALTER TABLE "account" RENAME COLUMN "refreshToken" TO "refresh_token";
ALTER TABLE "account" RENAME COLUMN "accessTokenExpiresAt" TO "access_token_expires_at";
ALTER TABLE "account" RENAME COLUMN "refreshTokenExpiresAt" TO "refresh_token_expires_at";
ALTER TABLE "account" RENAME COLUMN "idToken" TO "id_token";
ALTER TABLE "account" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "account" RENAME COLUMN "updatedAt" TO "updated_at";

-- RenameColumns: verification
ALTER TABLE "verification" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "verification" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "verification" RENAME COLUMN "updatedAt" TO "updated_at";

-- RenameColumns: organization
ALTER TABLE "organization" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "organization" RENAME COLUMN "updatedAt" TO "updated_at";

-- RenameColumns: member
ALTER TABLE "member" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "member" RENAME COLUMN "organizationId" TO "organization_id";
ALTER TABLE "member" RENAME COLUMN "createdAt" TO "created_at";

-- RenameColumns: invitation
ALTER TABLE "invitation" RENAME COLUMN "inviterId" TO "inviter_id";
ALTER TABLE "invitation" RENAME COLUMN "organizationId" TO "organization_id";
ALTER TABLE "invitation" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "invitation" RENAME COLUMN "createdAt" TO "created_at";

-- RenameColumns: api_key
ALTER TABLE "api_key" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "api_key" RENAME COLUMN "refillInterval" TO "refill_interval";
ALTER TABLE "api_key" RENAME COLUMN "refillAmount" TO "refill_amount";
ALTER TABLE "api_key" RENAME COLUMN "lastRefillAt" TO "last_refill_at";
ALTER TABLE "api_key" RENAME COLUMN "rateLimitEnabled" TO "rate_limit_enabled";
ALTER TABLE "api_key" RENAME COLUMN "rateLimitTimeWindow" TO "rate_limit_time_window";
ALTER TABLE "api_key" RENAME COLUMN "rateLimitMax" TO "rate_limit_max";
ALTER TABLE "api_key" RENAME COLUMN "requestCount" TO "request_count";
ALTER TABLE "api_key" RENAME COLUMN "lastRequest" TO "last_request";
ALTER TABLE "api_key" RENAME COLUMN "expiresAt" TO "expires_at";
ALTER TABLE "api_key" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "api_key" RENAME COLUMN "updatedAt" TO "updated_at";

-- RenameColumns: application
ALTER TABLE "application" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "application" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "application" RENAME COLUMN "organizationId" TO "organization_id";

-- RenameColumns: web_application_data
ALTER TABLE "web_application_data" RENAME COLUMN "applicationId" TO "application_id";

-- RenameColumns: mobile_application_data
ALTER TABLE "mobile_application_data" RENAME COLUMN "applicationId" TO "application_id";
ALTER TABLE "mobile_application_data" RENAME COLUMN "packageUrl" TO "package_url";

-- RenameColumns: test_plan
ALTER TABLE "test_plan" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "test_plan" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "test_plan" RENAME COLUMN "userId" TO "user_id";
ALTER TABLE "test_plan" RENAME COLUMN "organizationId" TO "organization_id";
ALTER TABLE "test_plan" RENAME COLUMN "applicationId" TO "application_id";

-- RenameColumns: test_generation
ALTER TABLE "test_generation" RENAME COLUMN "createdAt" TO "created_at";
ALTER TABLE "test_generation" RENAME COLUMN "updatedAt" TO "updated_at";
ALTER TABLE "test_generation" RENAME COLUMN "testPlanId" TO "test_plan_id";

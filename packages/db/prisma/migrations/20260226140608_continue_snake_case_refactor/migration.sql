-- AlterTable
ALTER TABLE "account" RENAME CONSTRAINT "Account_pkey" TO "account_pkey";

-- AlterTable
ALTER TABLE "api_key" RENAME CONSTRAINT "ApiKey_pkey" TO "api_key_pkey";

-- AlterTable
ALTER TABLE "application" RENAME CONSTRAINT "Application_pkey" TO "application_pkey";

-- AlterTable
ALTER TABLE "invitation" RENAME CONSTRAINT "Invitation_pkey" TO "invitation_pkey";

-- AlterTable
ALTER TABLE "member" RENAME CONSTRAINT "Member_pkey" TO "member_pkey";

-- AlterTable
ALTER TABLE "mobile_application_data" RENAME CONSTRAINT "MobileApplicationData_pkey" TO "mobile_application_data_pkey";

-- AlterTable
ALTER TABLE "organization" RENAME CONSTRAINT "Organization_pkey" TO "organization_pkey";

-- AlterTable
ALTER TABLE "session" RENAME CONSTRAINT "Session_pkey" TO "session_pkey";

-- AlterTable
ALTER TABLE "test_generation" RENAME CONSTRAINT "TestGeneration_pkey" TO "test_generation_pkey";

-- AlterTable
ALTER TABLE "test_plan" RENAME CONSTRAINT "TestPlan_pkey" TO "test_plan_pkey";

-- AlterTable
ALTER TABLE "user" RENAME CONSTRAINT "User_pkey" TO "user_pkey";

-- AlterTable
ALTER TABLE "verification" RENAME CONSTRAINT "Verification_pkey" TO "verification_pkey";

-- AlterTable
ALTER TABLE "web_application_data" RENAME CONSTRAINT "WebApplicationData_pkey" TO "web_application_data_pkey";

-- RenameForeignKey
ALTER TABLE "account" RENAME CONSTRAINT "Account_userId_fkey" TO "account_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "api_key" RENAME CONSTRAINT "ApiKey_userId_fkey" TO "api_key_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "application" RENAME CONSTRAINT "Application_organizationId_fkey" TO "application_organization_id_fkey";

-- RenameForeignKey
ALTER TABLE "invitation" RENAME CONSTRAINT "Invitation_inviterId_fkey" TO "invitation_inviter_id_fkey";

-- RenameForeignKey
ALTER TABLE "invitation" RENAME CONSTRAINT "Invitation_organizationId_fkey" TO "invitation_organization_id_fkey";

-- RenameForeignKey
ALTER TABLE "member" RENAME CONSTRAINT "Member_organizationId_fkey" TO "member_organization_id_fkey";

-- RenameForeignKey
ALTER TABLE "member" RENAME CONSTRAINT "Member_userId_fkey" TO "member_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "mobile_application_data" RENAME CONSTRAINT "MobileApplicationData_applicationId_fkey" TO "mobile_application_data_application_id_fkey";

-- RenameForeignKey
ALTER TABLE "session" RENAME CONSTRAINT "Session_userId_fkey" TO "session_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "test_generation" RENAME CONSTRAINT "TestGeneration_application_id_fkey" TO "test_generation_application_id_fkey";

-- RenameForeignKey
ALTER TABLE "test_generation" RENAME CONSTRAINT "TestGeneration_testPlanId_fkey" TO "test_generation_test_plan_id_fkey";

-- RenameForeignKey
ALTER TABLE "test_plan" RENAME CONSTRAINT "TestPlan_applicationId_fkey" TO "test_plan_application_id_fkey";

-- RenameForeignKey
ALTER TABLE "test_plan" RENAME CONSTRAINT "TestPlan_organizationId_fkey" TO "test_plan_organization_id_fkey";

-- RenameForeignKey
ALTER TABLE "test_plan" RENAME CONSTRAINT "TestPlan_userId_fkey" TO "test_plan_user_id_fkey";

-- RenameForeignKey
ALTER TABLE "web_application_data" RENAME CONSTRAINT "WebApplicationData_applicationId_fkey" TO "web_application_data_application_id_fkey";

-- RenameIndex
ALTER INDEX "ApiKey_userId_idx" RENAME TO "api_key_user_id_idx";

-- RenameIndex
ALTER INDEX "Application_name_organizationId_key" RENAME TO "application_name_organization_id_key";

-- RenameIndex
ALTER INDEX "Member_userId_organizationId_key" RENAME TO "member_user_id_organization_id_key";

-- RenameIndex
ALTER INDEX "Organization_domain_key" RENAME TO "organization_domain_key";

-- RenameIndex
ALTER INDEX "Organization_slug_key" RENAME TO "organization_slug_key";

-- RenameIndex
ALTER INDEX "Session_token_key" RENAME TO "session_token_key";

-- RenameIndex
ALTER INDEX "User_email_key" RENAME TO "user_email_key";

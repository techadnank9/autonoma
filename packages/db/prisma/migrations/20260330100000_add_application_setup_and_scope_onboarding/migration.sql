-- Migrate onboarding_state from organization-scoped to application-scoped
-- Clear seeded org-scoped rows; onboarding state is now per-application
DELETE FROM "onboarding_state";

ALTER TABLE "onboarding_state" DROP CONSTRAINT IF EXISTS "onboarding_state_organization_id_key";
ALTER TABLE "onboarding_state" DROP CONSTRAINT IF EXISTS "onboarding_state_organization_id_fkey";
ALTER TABLE "onboarding_state" DROP COLUMN IF EXISTS "organization_id";

ALTER TABLE "onboarding_state" ADD COLUMN "application_id" TEXT NOT NULL;

ALTER TABLE "onboarding_state" ADD CONSTRAINT "onboarding_state_application_id_key" UNIQUE ("application_id");

ALTER TABLE "onboarding_state" ADD CONSTRAINT "onboarding_state_application_id_fkey"
    FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create ApplicationSetup table
CREATE TABLE "application_setup" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "status" TEXT NOT NULL DEFAULT 'running',
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "total_steps" INTEGER NOT NULL DEFAULT 4,
    "error_message" TEXT,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,

    CONSTRAINT "application_setup_pkey" PRIMARY KEY ("id")
);

-- Create ApplicationSetupEvent table
CREATE TABLE "application_setup_event" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "setup_id" TEXT NOT NULL,

    CONSTRAINT "application_setup_event_pkey" PRIMARY KEY ("id")
);

-- Foreign keys for ApplicationSetup
ALTER TABLE "application_setup" ADD CONSTRAINT "application_setup_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "application_setup" ADD CONSTRAINT "application_setup_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "application_setup" ADD CONSTRAINT "application_setup_application_id_fkey"
    FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Foreign key for ApplicationSetupEvent
ALTER TABLE "application_setup_event" ADD CONSTRAINT "application_setup_event_setup_id_fkey"
    FOREIGN KEY ("setup_id") REFERENCES "application_setup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Indexes
CREATE INDEX "application_setup_application_id_idx" ON "application_setup"("application_id");
CREATE INDEX "application_setup_organization_id_idx" ON "application_setup"("organization_id");
CREATE INDEX "application_setup_event_setup_id_idx" ON "application_setup_event"("setup_id");

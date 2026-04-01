CREATE TABLE "onboarding_state" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "current_step" INTEGER NOT NULL DEFAULT 0,
    "agent_connected_at" TIMESTAMP(3),
    "agent_logs" JSONB NOT NULL DEFAULT '[]',
    "ngrok_url" TEXT,
    "ngrok_tests_passed" BOOLEAN NOT NULL DEFAULT false,
    "production_url" TEXT,
    "production_tests_passed" BOOLEAN NOT NULL DEFAULT false,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "onboarding_state_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "onboarding_state_organization_id_key" ON "onboarding_state"("organization_id");

ALTER TABLE "onboarding_state" ADD CONSTRAINT "onboarding_state_organization_id_fkey"
    FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

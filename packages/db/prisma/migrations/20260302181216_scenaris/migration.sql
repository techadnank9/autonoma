-- CreateEnum
CREATE TYPE "scenario_instance_status" AS ENUM ('REQUESTED', 'UP_SUCCESS', 'UP_FAILED', 'RUNNING_TESTS', 'DOWN_SUCCESS', 'DOWN_FAILED');

-- CreateEnum
CREATE TYPE "webhook_action" AS ENUM ('DISCOVER', 'UP', 'DOWN');

-- AlterTable
ALTER TABLE "application" ADD COLUMN     "signing_secret_enc" TEXT,
ADD COLUMN     "webhook_url" TEXT;

-- CreateTable
CREATE TABLE "scenario" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "last_seen_fingerprint" TEXT,
    "last_discovered_at" TIMESTAMP(3),
    "fingerprint_changed_at" TIMESTAMP(3),
    "is_disabled" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scenario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenario_instance" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "scenario_id" TEXT NOT NULL,
    "test_run_id" TEXT NOT NULL,
    "status" "scenario_instance_status" NOT NULL DEFAULT 'REQUESTED',
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "up_at" TIMESTAMP(3),
    "down_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "auth" JSONB,
    "refs" JSONB,
    "refs_token" TEXT,
    "metadata" JSONB,
    "last_error" JSONB,

    CONSTRAINT "scenario_instance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "webhook_call" (
    "id" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "instance_id" TEXT,
    "action" "webhook_action" NOT NULL,
    "request_body" JSONB NOT NULL,
    "response_body" JSONB,
    "status_code" INTEGER,
    "duration_ms" INTEGER,
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "webhook_call_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scenario_application_id_name_key" ON "scenario"("application_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "scenario_instance_application_id_test_run_id_key" ON "scenario_instance"("application_id", "test_run_id");

-- AddForeignKey
ALTER TABLE "scenario" ADD CONSTRAINT "scenario_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_instance" ADD CONSTRAINT "scenario_instance_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_instance" ADD CONSTRAINT "scenario_instance_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "scenario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_call" ADD CONSTRAINT "webhook_call_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_call" ADD CONSTRAINT "webhook_call_instance_id_fkey" FOREIGN KEY ("instance_id") REFERENCES "scenario_instance"("id") ON DELETE CASCADE ON UPDATE CASCADE;

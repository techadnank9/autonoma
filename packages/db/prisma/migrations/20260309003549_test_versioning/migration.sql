/*
  Warnings:

  - You are about to drop the column `test_id` on the `run` table. All the data in the column will be lost.
  - You are about to drop the column `application_id` on the `test_plan` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `test_plan` table. All the data in the column will be lost.
  - You are about to drop the column `plan` on the `test_plan` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `test_plan` table. All the data in the column will be lost.
  - You are about to drop the column `test_id` on the `test_tag` table. All the data in the column will be lost.
  - You are about to drop the `generation_step` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `mobile_application_data` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `run_step` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `test_step` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `web_application_data` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[main_branch_id]` on the table `application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug,organization_id]` on the table `application` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[outputs_id]` on the table `test_generation` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[test_case_id,tag_id]` on the table `test_tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `application` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `assignment_id` to the `run` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `run` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `scenario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `scenario_instance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `scenario_instance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `tag` table without a default value. This is not possible if the table is not empty.
  - Added the required column `organization_id` to the `test_generation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prompt` to the `test_plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_case_id` to the `test_plan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_case_id` to the `test_tag` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "application_mode" AS ENUM ('TRUNK_BASED', 'MAIN_ONLY', 'MANUAL');

-- CreateEnum
CREATE TYPE "trigger_source" AS ENUM ('GITHUB_PUSH', 'MANUAL', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "snapshot_status" AS ENUM ('processing', 'active', 'superseded', 'failed');

-- DropForeignKey
ALTER TABLE "generation_step" DROP CONSTRAINT "generation_step_generation_id_fkey";

-- DropForeignKey
ALTER TABLE "mobile_application_data" DROP CONSTRAINT "mobile_application_data_application_id_fkey";

-- DropForeignKey
ALTER TABLE "run" DROP CONSTRAINT "run_test_id_fkey";

-- DropForeignKey
ALTER TABLE "run_step" DROP CONSTRAINT "run_step_run_id_fkey";

-- DropForeignKey
ALTER TABLE "run_step" DROP CONSTRAINT "run_step_test_step_id_fkey";

-- DropForeignKey
ALTER TABLE "test" DROP CONSTRAINT "test_application_id_fkey";

-- DropForeignKey
ALTER TABLE "test" DROP CONSTRAINT "test_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "test" DROP CONSTRAINT "test_test_generation_id_fkey";

-- DropForeignKey
ALTER TABLE "test_plan" DROP CONSTRAINT "test_plan_application_id_fkey";

-- DropForeignKey
ALTER TABLE "test_plan" DROP CONSTRAINT "test_plan_user_id_fkey";

-- DropForeignKey
ALTER TABLE "test_step" DROP CONSTRAINT "test_step_test_id_fkey";

-- DropForeignKey
ALTER TABLE "test_tag" DROP CONSTRAINT "test_tag_test_id_fkey";

-- DropForeignKey
ALTER TABLE "web_application_data" DROP CONSTRAINT "web_application_data_application_id_fkey";

-- DropIndex
DROP INDEX "test_tag_test_id_tag_id_key";

-- AlterTable
ALTER TABLE "application" ADD COLUMN     "main_branch_id" TEXT,
ADD COLUMN     "mode" "application_mode" NOT NULL DEFAULT 'MAIN_ONLY',
ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "folder" ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "run" DROP COLUMN "test_id",
ADD COLUMN     "assignment_id" TEXT NOT NULL,
ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "scenario" ADD COLUMN     "organization_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "scenario_instance" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "organization_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "tag" ADD COLUMN     "organization_id" TEXT NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "test_generation" ADD COLUMN     "organization_id" TEXT NOT NULL,
ADD COLUMN     "outputs_id" TEXT,
ADD COLUMN     "steps_id" TEXT;

-- AlterTable
ALTER TABLE "test_plan" DROP COLUMN "application_id",
DROP COLUMN "name",
DROP COLUMN "plan",
DROP COLUMN "user_id",
ADD COLUMN     "prompt" TEXT NOT NULL,
ADD COLUMN     "test_case_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "test_tag" DROP COLUMN "test_id",
ADD COLUMN     "test_case_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "generation_step";

-- DropTable
DROP TABLE "mobile_application_data";

-- DropTable
DROP TABLE "run_step";

-- DropTable
DROP TABLE "test";

-- DropTable
DROP TABLE "test_step";

-- DropTable
DROP TABLE "web_application_data";

-- DropEnum
DROP TYPE "run_step_status";

-- CreateTable
CREATE TABLE "branch_deployment" (
    "id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "branch_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "branch_deployment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "web_deployment" (
    "deployment_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "web_deployment_pkey" PRIMARY KEY ("deployment_id")
);

-- CreateTable
CREATE TABLE "mobile_deployment" (
    "deployment_id" TEXT NOT NULL,
    "package_url" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "mobile_deployment_pkey" PRIMARY KEY ("deployment_id")
);

-- CreateTable
CREATE TABLE "branch" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "github_ref" TEXT,
    "application_id" TEXT NOT NULL,
    "deployment_id" TEXT,
    "active_snapshot_id" TEXT,
    "pending_snapshot_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_snapshot" (
    "id" TEXT NOT NULL,
    "status" "snapshot_status" NOT NULL DEFAULT 'processing',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branch_id" TEXT NOT NULL,
    "source" "trigger_source" NOT NULL,
    "head_sha" TEXT,
    "base_sha" TEXT,
    "payload" JSONB,
    "deployment_id" TEXT,
    "prev_snapshot_id" TEXT,

    CONSTRAINT "branch_snapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branch_assignment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshot_id" TEXT NOT NULL,
    "test_case_id" TEXT NOT NULL,
    "plan_id" TEXT,
    "steps_id" TEXT,
    "main_assignment_id" TEXT,

    CONSTRAINT "branch_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_case" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "application_id" TEXT NOT NULL,
    "folder_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "test_case_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_input_list" (
    "id" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "step_input_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_input" (
    "id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "interaction" TEXT NOT NULL,
    "params" JSONB NOT NULL,
    "wait_condition" TEXT,
    "screenshot_before" TEXT,
    "screenshot_after" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "step_input_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_output_list" (
    "id" TEXT NOT NULL,
    "run_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "step_output_list_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "step_output" (
    "id" TEXT NOT NULL,
    "list_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "output" JSONB NOT NULL,
    "step_input_id" TEXT NOT NULL,
    "screenshot_before" TEXT,
    "screenshot_after" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "step_output_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "branch_deployment_branch_id_idx" ON "branch_deployment"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_deployment_id_key" ON "branch"("deployment_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_active_snapshot_id_key" ON "branch"("active_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_pending_snapshot_id_key" ON "branch"("pending_snapshot_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_application_id_name_key" ON "branch"("application_id", "name");

-- CreateIndex
CREATE INDEX "branch_snapshot_branch_id_idx" ON "branch_snapshot"("branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "branch_assignment_snapshot_id_test_case_id_key" ON "branch_assignment"("snapshot_id", "test_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_case_application_id_slug_key" ON "test_case"("application_id", "slug");

-- CreateIndex
CREATE INDEX "step_input_list_id_idx" ON "step_input"("list_id");

-- CreateIndex
CREATE UNIQUE INDEX "step_input_list_id_order_key" ON "step_input"("list_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "step_output_list_run_id_key" ON "step_output_list"("run_id");

-- CreateIndex
CREATE INDEX "step_output_list_id_idx" ON "step_output"("list_id");

-- CreateIndex
CREATE UNIQUE INDEX "step_output_list_id_order_key" ON "step_output"("list_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "application_main_branch_id_key" ON "application"("main_branch_id");

-- CreateIndex
CREATE UNIQUE INDEX "application_slug_organization_id_key" ON "application"("slug", "organization_id");

-- CreateIndex
CREATE INDEX "run_assignment_id_idx" ON "run"("assignment_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_generation_outputs_id_key" ON "test_generation"("outputs_id");

-- CreateIndex
CREATE INDEX "test_plan_test_case_id_idx" ON "test_plan"("test_case_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_tag_test_case_id_tag_id_key" ON "test_tag"("test_case_id", "tag_id");

-- AddForeignKey
ALTER TABLE "application" ADD CONSTRAINT "application_main_branch_id_fkey" FOREIGN KEY ("main_branch_id") REFERENCES "branch"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_deployment" ADD CONSTRAINT "branch_deployment_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_deployment" ADD CONSTRAINT "branch_deployment_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_deployment" ADD CONSTRAINT "web_deployment_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "branch_deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "web_deployment" ADD CONSTRAINT "web_deployment_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_deployment" ADD CONSTRAINT "mobile_deployment_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "branch_deployment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mobile_deployment" ADD CONSTRAINT "mobile_deployment_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "branch_deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_active_snapshot_id_fkey" FOREIGN KEY ("active_snapshot_id") REFERENCES "branch_snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_pending_snapshot_id_fkey" FOREIGN KEY ("pending_snapshot_id") REFERENCES "branch_snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch" ADD CONSTRAINT "branch_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_snapshot" ADD CONSTRAINT "branch_snapshot_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_snapshot" ADD CONSTRAINT "branch_snapshot_deployment_id_fkey" FOREIGN KEY ("deployment_id") REFERENCES "branch_deployment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_snapshot" ADD CONSTRAINT "branch_snapshot_prev_snapshot_id_fkey" FOREIGN KEY ("prev_snapshot_id") REFERENCES "branch_snapshot"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_assignment" ADD CONSTRAINT "branch_assignment_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "branch_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_assignment" ADD CONSTRAINT "branch_assignment_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_assignment" ADD CONSTRAINT "branch_assignment_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "test_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_assignment" ADD CONSTRAINT "branch_assignment_steps_id_fkey" FOREIGN KEY ("steps_id") REFERENCES "step_input_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "branch_assignment" ADD CONSTRAINT "branch_assignment_main_assignment_id_fkey" FOREIGN KEY ("main_assignment_id") REFERENCES "branch_assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_case" ADD CONSTRAINT "test_case_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_case" ADD CONSTRAINT "test_case_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_case" ADD CONSTRAINT "test_case_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_plan" ADD CONSTRAINT "test_plan_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_generation" ADD CONSTRAINT "test_generation_steps_id_fkey" FOREIGN KEY ("steps_id") REFERENCES "step_input_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_generation" ADD CONSTRAINT "test_generation_outputs_id_fkey" FOREIGN KEY ("outputs_id") REFERENCES "step_output_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_generation" ADD CONSTRAINT "test_generation_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_input_list" ADD CONSTRAINT "step_input_list_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "test_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_input_list" ADD CONSTRAINT "step_input_list_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_input" ADD CONSTRAINT "step_input_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "step_input_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_input" ADD CONSTRAINT "step_input_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_output_list" ADD CONSTRAINT "step_output_list_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_output_list" ADD CONSTRAINT "step_output_list_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_output" ADD CONSTRAINT "step_output_step_input_id_fkey" FOREIGN KEY ("step_input_id") REFERENCES "step_input"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_output" ADD CONSTRAINT "step_output_list_id_fkey" FOREIGN KEY ("list_id") REFERENCES "step_output_list"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "step_output" ADD CONSTRAINT "step_output_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag" ADD CONSTRAINT "tag_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_tag" ADD CONSTRAINT "test_tag_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "branch_assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario" ADD CONSTRAINT "scenario_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenario_instance" ADD CONSTRAINT "scenario_instance_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

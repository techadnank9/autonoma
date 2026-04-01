-- RenameTable: branch_assignment -> test_case_assignment
ALTER TABLE "branch_assignment" RENAME TO "test_case_assignment";

-- Rename constraints for test_case_assignment
ALTER TABLE "test_case_assignment" RENAME CONSTRAINT "branch_assignment_pkey" TO "test_case_assignment_pkey";

-- Rename indexes for test_case_assignment
ALTER INDEX "branch_assignment_snapshot_id_test_case_id_key" RENAME TO "test_case_assignment_snapshot_id_test_case_id_key";

-- Drop old foreign keys on test_case_assignment
ALTER TABLE "test_case_assignment" DROP CONSTRAINT "branch_assignment_snapshot_id_fkey";
ALTER TABLE "test_case_assignment" DROP CONSTRAINT "branch_assignment_test_case_id_fkey";
ALTER TABLE "test_case_assignment" DROP CONSTRAINT "branch_assignment_plan_id_fkey";
ALTER TABLE "test_case_assignment" DROP CONSTRAINT "branch_assignment_steps_id_fkey";
ALTER TABLE "test_case_assignment" DROP CONSTRAINT "branch_assignment_main_assignment_id_fkey";

-- Re-add foreign keys with new names
ALTER TABLE "test_case_assignment" ADD CONSTRAINT "test_case_assignment_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "branch_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "test_case_assignment" ADD CONSTRAINT "test_case_assignment_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_case"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "test_case_assignment" ADD CONSTRAINT "test_case_assignment_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "test_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "test_case_assignment" ADD CONSTRAINT "test_case_assignment_steps_id_fkey" FOREIGN KEY ("steps_id") REFERENCES "step_input_list"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "test_case_assignment" ADD CONSTRAINT "test_case_assignment_main_assignment_id_fkey" FOREIGN KEY ("main_assignment_id") REFERENCES "test_case_assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Update run table foreign key to reference renamed table
ALTER TABLE "run" DROP CONSTRAINT "run_assignment_id_fkey";
ALTER TABLE "run" ADD CONSTRAINT "run_assignment_id_fkey" FOREIGN KEY ("assignment_id") REFERENCES "test_case_assignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable: skill
CREATE TABLE "skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skill_application_id_slug_key" ON "skill"("application_id", "slug");

-- CreateTable: skill_plan
CREATE TABLE "skill_plan" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "skill_plan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "skill_plan_skill_id_idx" ON "skill_plan"("skill_id");

-- CreateTable: skill_assignment
CREATE TABLE "skill_assignment" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "snapshot_id" TEXT NOT NULL,
    "skill_id" TEXT NOT NULL,
    "plan_id" TEXT,
    "main_assignment_id" TEXT,

    CONSTRAINT "skill_assignment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "skill_assignment_snapshot_id_skill_id_key" ON "skill_assignment"("snapshot_id", "skill_id");

-- AddForeignKey: skill
ALTER TABLE "skill" ADD CONSTRAINT "skill_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "application"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill" ADD CONSTRAINT "skill_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: skill_plan
ALTER TABLE "skill_plan" ADD CONSTRAINT "skill_plan_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_plan" ADD CONSTRAINT "skill_plan_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey: skill_assignment
ALTER TABLE "skill_assignment" ADD CONSTRAINT "skill_assignment_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "branch_snapshot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_assignment" ADD CONSTRAINT "skill_assignment_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "skill_assignment" ADD CONSTRAINT "skill_assignment_plan_id_fkey" FOREIGN KEY ("plan_id") REFERENCES "skill_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "skill_assignment" ADD CONSTRAINT "skill_assignment_main_assignment_id_fkey" FOREIGN KEY ("main_assignment_id") REFERENCES "skill_assignment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

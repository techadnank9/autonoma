/*
  Warnings:

  - You are about to drop the column `application_id` on the `test_generation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "test_generation" DROP CONSTRAINT "test_generation_application_id_fkey";

-- AlterTable
ALTER TABLE "run" ADD COLUMN     "scenario_instance_id" TEXT;

-- AlterTable
ALTER TABLE "test_generation" DROP COLUMN "application_id",
ADD COLUMN     "scenario_instance_id" TEXT,
ADD COLUMN     "snapshot_id" TEXT;

-- Backfill: set snapshot_id from the application's main branch active snapshot
UPDATE test_generation tg
SET snapshot_id = b.active_snapshot_id
FROM test_plan tp
JOIN test_case tc ON tc.id = tp.test_case_id
JOIN application a ON a.id = tc.application_id
JOIN branch b ON b.id = a.main_branch_id
WHERE tg.test_plan_id = tp.id
  AND tg.snapshot_id IS NULL
  AND b.active_snapshot_id IS NOT NULL;

-- Delete generations that could not be backfilled
DELETE FROM test_generation WHERE snapshot_id IS NULL;

-- Now make snapshot_id NOT NULL
ALTER TABLE "test_generation" ALTER COLUMN "snapshot_id" SET NOT NULL;

-- AlterTable
ALTER TABLE "test_plan" ADD COLUMN     "scenario_id" TEXT;

-- AddForeignKey
ALTER TABLE "test_plan" ADD CONSTRAINT "test_plan_scenario_id_fkey" FOREIGN KEY ("scenario_id") REFERENCES "scenario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_generation" ADD CONSTRAINT "test_generation_snapshot_id_fkey" FOREIGN KEY ("snapshot_id") REFERENCES "branch_snapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_generation" ADD CONSTRAINT "test_generation_scenario_instance_id_fkey" FOREIGN KEY ("scenario_instance_id") REFERENCES "scenario_instance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run" ADD CONSTRAINT "run_scenario_instance_id_fkey" FOREIGN KEY ("scenario_instance_id") REFERENCES "scenario_instance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

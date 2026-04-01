/*
  Warnings:

  - You are about to drop the column `test_run_id` on the `scenario_instance` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "scenario_instance_application_id_test_run_id_key";

-- AlterTable
ALTER TABLE "scenario_instance" DROP COLUMN "test_run_id";

-- CreateEnum
CREATE TYPE "run_status" AS ENUM ('pending', 'running', 'success', 'failed');

-- AlterTable
ALTER TABLE "run" ADD COLUMN "status" "run_status" NOT NULL DEFAULT 'pending';

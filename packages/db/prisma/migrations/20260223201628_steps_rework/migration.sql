/*
  Warnings:

  - You are about to drop the column `element` on the `run_step` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `run_step` table. All the data in the column will be lost.
  - You are about to drop the column `reasoning` on the `run_step` table. All the data in the column will be lost.
  - You are about to drop the column `element` on the `test_step` table. All the data in the column will be lost.
  - You are about to drop the column `instruction` on the `test_step` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `test_step` table. All the data in the column will be lost.
  - You are about to drop the column `reasoning` on the `test_step` table. All the data in the column will be lost.
  - You are about to drop the `conversation_message` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[run_id,order]` on the table `run_step` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[run_id,test_step_id]` on the table `run_step` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[test_id,order]` on the table `test_step` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `output` to the `run_step` table without a default value. This is not possible if the table is not empty.
  - Added the required column `params` to the `test_step` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `interaction` on the `test_step` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('pending', 'running', 'success', 'failed');

-- DropForeignKey
ALTER TABLE "conversation_message" DROP CONSTRAINT "conversation_message_test_generation_id_fkey";

-- AlterTable
ALTER TABLE "TestGeneration" ADD COLUMN     "conversation" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "reasoning" TEXT,
ADD COLUMN     "status" "GenerationStatus" NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "run_step" DROP COLUMN "element",
DROP COLUMN "message",
DROP COLUMN "reasoning",
ADD COLUMN     "output" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "test_step" DROP COLUMN "element",
DROP COLUMN "instruction",
DROP COLUMN "message",
DROP COLUMN "reasoning",
ADD COLUMN     "params" JSONB NOT NULL,
ADD COLUMN     "wait_condition" TEXT,
DROP COLUMN "interaction",
ADD COLUMN     "interaction" TEXT NOT NULL;

-- DropTable
DROP TABLE "conversation_message";

-- DropEnum
DROP TYPE "interaction";

-- CreateTable
CREATE TABLE "generation_step" (
    "id" TEXT NOT NULL,
    "generation_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "order" INTEGER NOT NULL,
    "interaction" TEXT NOT NULL,
    "params" JSONB NOT NULL,
    "output" JSONB NOT NULL,
    "wait_condition" TEXT,
    "screenshot_before" TEXT,
    "screenshot_after" TEXT,

    CONSTRAINT "generation_step_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "generation_step_generation_id_order_key" ON "generation_step"("generation_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "run_step_run_id_order_key" ON "run_step"("run_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "run_step_run_id_test_step_id_key" ON "run_step"("run_id", "test_step_id");

-- CreateIndex
CREATE UNIQUE INDEX "test_step_test_id_order_key" ON "test_step"("test_id", "order");

-- AddForeignKey
ALTER TABLE "generation_step" ADD CONSTRAINT "generation_step_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "TestGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

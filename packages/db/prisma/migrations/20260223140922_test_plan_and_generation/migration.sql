/*
  Warnings:

  - You are about to drop the column `generation_id` on the `conversation_message` table. All the data in the column will be lost.
  - You are about to drop the column `generation_id` on the `test` table. All the data in the column will be lost.
  - You are about to drop the `generation` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[test_generation_id]` on the table `test` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `test_generation_id` to the `conversation_message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `test_generation_id` to the `test` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "conversation_message" DROP CONSTRAINT "conversation_message_generation_id_fkey";

-- DropForeignKey
ALTER TABLE "generation" DROP CONSTRAINT "generation_application_id_fkey";

-- DropForeignKey
ALTER TABLE "test" DROP CONSTRAINT "test_generation_id_fkey";

-- AlterTable
ALTER TABLE "conversation_message" DROP COLUMN "generation_id",
ADD COLUMN     "test_generation_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "test" DROP COLUMN "generation_id",
ADD COLUMN     "test_generation_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "generation";

-- CreateTable
CREATE TABLE "TestPlan" (
    "id" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "organizationId" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,

    CONSTRAINT "TestPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TestGeneration" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "testPlanId" TEXT NOT NULL,
    "application_id" TEXT NOT NULL,

    CONSTRAINT "TestGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "test_test_generation_id_key" ON "test"("test_generation_id");

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_test_generation_id_fkey" FOREIGN KEY ("test_generation_id") REFERENCES "TestGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPlan" ADD CONSTRAINT "TestPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPlan" ADD CONSTRAINT "TestPlan_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestPlan" ADD CONSTRAINT "TestPlan_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestGeneration" ADD CONSTRAINT "TestGeneration_testPlanId_fkey" FOREIGN KEY ("testPlanId") REFERENCES "TestPlan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestGeneration" ADD CONSTRAINT "TestGeneration_application_id_fkey" FOREIGN KEY ("application_id") REFERENCES "Application"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conversation_message" ADD CONSTRAINT "conversation_message_test_generation_id_fkey" FOREIGN KEY ("test_generation_id") REFERENCES "TestGeneration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

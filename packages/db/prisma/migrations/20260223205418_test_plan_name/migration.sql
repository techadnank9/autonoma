/*
  Warnings:

  - Added the required column `name` to the `TestPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TestPlan" ADD COLUMN     "name" TEXT NOT NULL;

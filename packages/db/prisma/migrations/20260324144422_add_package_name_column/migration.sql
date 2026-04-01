/*
  Warnings:

  - Added the required column `package_name` to the `mobile_deployment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "mobile_deployment" ADD COLUMN     "package_name" TEXT NOT NULL;

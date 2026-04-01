-- CreateEnum
CREATE TYPE "OrganizationStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Organization" ADD COLUMN "domain" TEXT,
ADD COLUMN "status" "OrganizationStatus" NOT NULL DEFAULT 'approved';

-- CreateIndex
CREATE UNIQUE INDEX "Organization_domain_key" ON "Organization"("domain");

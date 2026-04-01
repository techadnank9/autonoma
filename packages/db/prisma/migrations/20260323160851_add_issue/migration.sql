-- CreateEnum
CREATE TYPE "issue_severity" AS ENUM ('critical', 'high', 'medium', 'low');

-- CreateEnum
CREATE TYPE "issue_category" AS ENUM ('application_bug', 'agent_error');

-- CreateTable
CREATE TABLE "issue" (
    "id" TEXT NOT NULL,
    "review_id" TEXT NOT NULL,
    "category" "issue_category" NOT NULL,
    "confidence" INTEGER NOT NULL,
    "severity" "issue_severity" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "issue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "issue_review_id_key" ON "issue"("review_id");

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_review_id_fkey" FOREIGN KEY ("review_id") REFERENCES "generation_review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

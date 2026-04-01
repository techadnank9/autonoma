-- CreateEnum
CREATE TYPE "bug_status" AS ENUM ('open', 'resolved', 'regressed');

-- CreateTable
CREATE TABLE "bug" (
    "id" TEXT NOT NULL,
    "status" "bug_status" NOT NULL DEFAULT 'open',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "issue_severity" NOT NULL,
    "branch_id" TEXT NOT NULL,
    "test_case_id" TEXT NOT NULL,
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "bug_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "issue" ADD COLUMN "bug_id" TEXT,
ADD COLUMN "dismissed" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "bug_branch_id_test_case_id_idx" ON "bug"("branch_id", "test_case_id");

-- CreateIndex
CREATE INDEX "bug_status_idx" ON "bug"("status");

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_bug_id_fkey" FOREIGN KEY ("bug_id") REFERENCES "bug"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bug" ADD CONSTRAINT "bug_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bug" ADD CONSTRAINT "bug_test_case_id_fkey" FOREIGN KEY ("test_case_id") REFERENCES "test_case"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bug" ADD CONSTRAINT "bug_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

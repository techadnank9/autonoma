-- AlterTable
ALTER TABLE "ai_cost_record" ADD COLUMN     "run_id" TEXT,
ALTER COLUMN "generation_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "issue" ADD COLUMN     "run_review_id" TEXT,
ALTER COLUMN "review_id" DROP NOT NULL;

-- CreateTable
CREATE TABLE "run_review" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "status" "generation_review_status" NOT NULL DEFAULT 'pending',
    "verdict" "generation_review_verdict",
    "reasoning" TEXT,
    "analysis" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "run_review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "run_review_run_id_key" ON "run_review"("run_id");

-- CreateIndex
CREATE INDEX "ai_cost_record_run_id_idx" ON "ai_cost_record"("run_id");

-- CreateIndex
CREATE UNIQUE INDEX "issue_run_review_id_key" ON "issue"("run_review_id");

-- AddForeignKey
ALTER TABLE "run_review" ADD CONSTRAINT "run_review_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "run_review" ADD CONSTRAINT "run_review_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "issue" ADD CONSTRAINT "issue_run_review_id_fkey" FOREIGN KEY ("run_review_id") REFERENCES "run_review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_cost_record" ADD CONSTRAINT "ai_cost_record_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "run"("id") ON DELETE CASCADE ON UPDATE CASCADE;

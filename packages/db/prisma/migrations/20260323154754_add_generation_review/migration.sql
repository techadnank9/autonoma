-- CreateEnum
CREATE TYPE "generation_review_verdict" AS ENUM ('agent_error', 'application_bug');

-- CreateTable
CREATE TABLE "generation_review" (
    "id" TEXT NOT NULL,
    "generation_id" TEXT NOT NULL,
    "verdict" "generation_review_verdict" NOT NULL,
    "reasoning" TEXT NOT NULL,
    "analysis" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "organization_id" TEXT NOT NULL,

    CONSTRAINT "generation_review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "generation_review_generation_id_key" ON "generation_review"("generation_id");

-- AddForeignKey
ALTER TABLE "generation_review" ADD CONSTRAINT "generation_review_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "test_generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation_review" ADD CONSTRAINT "generation_review_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

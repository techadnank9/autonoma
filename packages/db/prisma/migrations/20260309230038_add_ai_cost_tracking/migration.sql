-- CreateTable
CREATE TABLE "ai_cost_record" (
    "id" TEXT NOT NULL,
    "generation_id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "tag" TEXT NOT NULL,
    "input_tokens" INTEGER NOT NULL,
    "output_tokens" INTEGER NOT NULL,
    "reasoning_tokens" INTEGER NOT NULL DEFAULT 0,
    "cache_read_tokens" INTEGER NOT NULL DEFAULT 0,
    "cost_microdollars" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_cost_record_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ai_cost_record_generation_id_idx" ON "ai_cost_record"("generation_id");

-- AddForeignKey
ALTER TABLE "ai_cost_record" ADD CONSTRAINT "ai_cost_record_generation_id_fkey" FOREIGN KEY ("generation_id") REFERENCES "test_generation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

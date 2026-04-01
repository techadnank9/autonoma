-- AlterEnum
ALTER TYPE "generation_status" ADD VALUE 'queued';

-- CreateIndex
CREATE INDEX "test_generation_snapshot_id_idx" ON "test_generation"("snapshot_id");

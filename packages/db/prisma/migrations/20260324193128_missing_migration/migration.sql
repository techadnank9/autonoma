-- CreateEnum
CREATE TYPE "generation_review_status" AS ENUM ('pending', 'completed');

-- AlterTable
ALTER TABLE "generation_review" ADD COLUMN     "status" "generation_review_status" NOT NULL DEFAULT 'pending',
ALTER COLUMN "verdict" DROP NOT NULL,
ALTER COLUMN "reasoning" DROP NOT NULL;

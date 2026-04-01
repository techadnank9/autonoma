-- AlterEnum
ALTER TYPE "credit_transaction_type" ADD VALUE IF NOT EXISTS 'TOPUP_REFUND';

-- AlterTable
ALTER TABLE "credit_transaction" ADD COLUMN "stripe_refund_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "credit_transaction_stripe_refund_id_key" ON "credit_transaction"("stripe_refund_id");

ALTER TYPE "credit_transaction_type" ADD VALUE IF NOT EXISTS 'GENERATION_CONSUMPTION';
ALTER TYPE "credit_transaction_type" ADD VALUE IF NOT EXISTS 'GENERATION_REFUND';

ALTER TABLE "billing_pricing"
ADD COLUMN IF NOT EXISTS "credits_web_generation_cost" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN IF NOT EXISTS "credits_mobile_generation_cost" INTEGER NOT NULL DEFAULT 3;

ALTER TABLE "credit_transaction"
ADD COLUMN IF NOT EXISTS "run_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "credit_transaction_run_id_key" ON "credit_transaction"("run_id");

UPDATE "billing_pricing"
SET
  "credits_web_generation_cost" = "credits_web_run_cost",
  "credits_mobile_generation_cost" = "credits_mobile_run_cost";

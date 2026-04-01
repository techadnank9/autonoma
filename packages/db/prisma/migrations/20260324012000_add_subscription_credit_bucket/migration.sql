-- AlterEnum
ALTER TYPE "credit_transaction_type" ADD VALUE IF NOT EXISTS 'SUBSCRIPTION_RESET';

-- AlterTable
ALTER TABLE "billing_customer"
ADD COLUMN "subscription_credit_balance" INTEGER NOT NULL DEFAULT 0;

-- Backfill existing rows to keep current behavior stable until next subscription renewal.
UPDATE "billing_customer"
SET "subscription_credit_balance" = "credit_balance"
WHERE "subscription_credit_balance" = 0;

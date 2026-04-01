ALTER TYPE "credit_transaction_type" ADD VALUE IF NOT EXISTS 'FREE_START_GRANT';

ALTER TABLE "billing_customer"
ALTER COLUMN "stripe_customer_id" DROP NOT NULL;

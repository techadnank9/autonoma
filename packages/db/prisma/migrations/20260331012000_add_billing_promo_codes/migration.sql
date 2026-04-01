ALTER TYPE "credit_transaction_type" ADD VALUE IF NOT EXISTS 'PROMO_GRANT';

CREATE TABLE IF NOT EXISTS "billing_promo_code" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "grant_credits" INTEGER NOT NULL,
    "max_redemptions" INTEGER,
    "redeemed_count" INTEGER NOT NULL DEFAULT 0,
    "starts_at" TIMESTAMP(3),
    "ends_at" TIMESTAMP(3),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_promo_code_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "billing_promo_code_code_key" ON "billing_promo_code"("code");

CREATE TABLE IF NOT EXISTS "billing_promo_redemption" (
    "id" TEXT NOT NULL,
    "promo_code_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "redeemed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "billing_promo_redemption_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "billing_promo_redemption_promo_code_id_fkey"
        FOREIGN KEY ("promo_code_id") REFERENCES "billing_promo_code"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "billing_promo_redemption_organization_id_fkey"
        FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "billing_promo_redemption_promo_code_id_idx" ON "billing_promo_redemption"("promo_code_id");
CREATE INDEX IF NOT EXISTS "billing_promo_redemption_organization_id_idx" ON "billing_promo_redemption"("organization_id");

ALTER TABLE "credit_transaction"
ADD COLUMN IF NOT EXISTS "promo_redemption_id" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "credit_transaction_promo_redemption_id_key"
ON "credit_transaction"("promo_redemption_id");

DO $$
BEGIN
  IF NOT EXISTS (
      SELECT 1
      FROM pg_constraint
      WHERE conname = 'credit_transaction_promo_redemption_id_fkey'
  ) THEN
    ALTER TABLE "credit_transaction"
    ADD CONSTRAINT "credit_transaction_promo_redemption_id_fkey"
    FOREIGN KEY ("promo_redemption_id")
    REFERENCES "billing_promo_redemption"("id")
    ON DELETE SET NULL
    ON UPDATE CASCADE;
  END IF;
END $$;

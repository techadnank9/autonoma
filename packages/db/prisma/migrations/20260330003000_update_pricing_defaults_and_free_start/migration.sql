ALTER TABLE "billing_pricing"
ADD COLUMN IF NOT EXISTS "credits_free_start" INTEGER NOT NULL DEFAULT 100000;

ALTER TABLE "billing_pricing"
ALTER COLUMN "credits_per_subscription" SET DEFAULT 1000000,
ALTER COLUMN "credits_per_topup" SET DEFAULT 150000,
ALTER COLUMN "credits_web_generation_cost" SET DEFAULT 500,
ALTER COLUMN "credits_ios_generation_cost" SET DEFAULT 700,
ALTER COLUMN "credits_android_generation_cost" SET DEFAULT 540,
ALTER COLUMN "credits_web_run_cost" SET DEFAULT 10,
ALTER COLUMN "credits_ios_run_cost" SET DEFAULT 200,
ALTER COLUMN "credits_android_run_cost" SET DEFAULT 40,
ALTER COLUMN "stripe_topup_amount_cents" SET DEFAULT 10000,
ALTER COLUMN "credits_free_start" SET DEFAULT 100000;

UPDATE "billing_pricing"
SET
  "credits_per_subscription" = 1000000,
  "credits_per_topup" = 150000,
  "credits_web_generation_cost" = 500,
  "credits_ios_generation_cost" = 700,
  "credits_android_generation_cost" = 540,
  "credits_web_run_cost" = 10,
  "credits_ios_run_cost" = 200,
  "credits_android_run_cost" = 40,
  "stripe_topup_amount_cents" = 10000,
  "credits_free_start" = 100000;

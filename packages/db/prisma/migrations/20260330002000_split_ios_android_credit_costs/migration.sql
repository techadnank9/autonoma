ALTER TABLE "billing_pricing"
ADD COLUMN IF NOT EXISTS "credits_ios_generation_cost" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS "credits_android_generation_cost" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS "credits_ios_run_cost" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN IF NOT EXISTS "credits_android_run_cost" INTEGER NOT NULL DEFAULT 3;

UPDATE "billing_pricing"
SET
  "credits_ios_generation_cost" = "credits_mobile_generation_cost",
  "credits_android_generation_cost" = "credits_mobile_generation_cost",
  "credits_ios_run_cost" = "credits_mobile_run_cost",
  "credits_android_run_cost" = "credits_mobile_run_cost";

ALTER TABLE "billing_pricing"
DROP COLUMN IF EXISTS "credits_mobile_generation_cost",
DROP COLUMN IF EXISTS "credits_mobile_run_cost";

-- CreateTable
CREATE TABLE "billing_pricing" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "credits_per_subscription" INTEGER NOT NULL DEFAULT 1000,
    "credits_per_topup" INTEGER NOT NULL DEFAULT 200,
    "credits_web_run_cost" INTEGER NOT NULL DEFAULT 1,
    "credits_mobile_run_cost" INTEGER NOT NULL DEFAULT 3,
    "stripe_topup_amount_cents" INTEGER NOT NULL DEFAULT 10000,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billing_pricing_organization_id_key" ON "billing_pricing"("organization_id");

-- AddForeignKey
ALTER TABLE "billing_pricing" ADD CONSTRAINT "billing_pricing_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "subscription_status" AS ENUM ('active', 'canceled', 'past_due', 'unpaid', 'trialing', 'paused', 'incomplete', 'incomplete_expired');

-- CreateEnum
CREATE TYPE "credit_transaction_type" AS ENUM ('SUBSCRIPTION_GRANT', 'TOPUP_PURCHASE', 'RUN_CONSUMPTION');

-- CreateTable
CREATE TABLE "billing_customer" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "stripe_customer_id" TEXT NOT NULL,
    "subscription_id" TEXT,
    "subscription_status" "subscription_status",
    "price_id" TEXT,
    "current_period_start" TIMESTAMP(3),
    "current_period_end" TIMESTAMP(3),
    "cancel_at_period_end" BOOLEAN NOT NULL DEFAULT false,
    "credit_balance" INTEGER NOT NULL DEFAULT 0,
    "auto_top_up_enabled" BOOLEAN NOT NULL DEFAULT false,
    "auto_top_up_threshold" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "billing_customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_transaction" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "type" "credit_transaction_type" NOT NULL,
    "amount" INTEGER NOT NULL,
    "balance_after" INTEGER NOT NULL,
    "generation_id" TEXT,
    "stripe_payment_intent_id" TEXT,
    "stripe_invoice_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "billing_customer_organization_id_key" ON "billing_customer"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "billing_customer_stripe_customer_id_key" ON "billing_customer"("stripe_customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_transaction_generation_id_key" ON "credit_transaction"("generation_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_transaction_stripe_payment_intent_id_key" ON "credit_transaction"("stripe_payment_intent_id");

-- CreateIndex
CREATE UNIQUE INDEX "credit_transaction_stripe_invoice_id_key" ON "credit_transaction"("stripe_invoice_id");

-- CreateIndex
CREATE INDEX "credit_transaction_organization_id_idx" ON "credit_transaction"("organization_id");

-- AddForeignKey
ALTER TABLE "billing_customer" ADD CONSTRAINT "billing_customer_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_transaction" ADD CONSTRAINT "credit_transaction_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "billing_customer"("organization_id") ON DELETE CASCADE ON UPDATE CASCADE;

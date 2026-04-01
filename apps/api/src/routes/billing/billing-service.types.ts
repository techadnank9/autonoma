import type { ApplicationArchitecture } from "@autonoma/db";
import type { BillingCheckoutType } from "@autonoma/types";
import type { BillingCustomerService } from "./billing-customer.service.ts";
import type { BillingPromoService } from "./billing-promo.service.ts";

export type BillingConsumptionTarget = "generation" | "run";
export type DeductGenerationContext = {
    organizationId: string;
    architecture: ApplicationArchitecture;
};

export interface BillingService {
    getOrCreateCustomer(
        organizationId: string,
        orgName: string,
    ): ReturnType<BillingCustomerService["getOrCreateCustomer"]>;
    createCheckoutSession(
        organizationId: string,
        type: BillingCheckoutType,
    ): ReturnType<BillingCustomerService["createCheckoutSession"]>;
    createPortalSession(organizationId: string): ReturnType<BillingCustomerService["createPortalSession"]>;
    getBillingStatus(organizationId: string): ReturnType<BillingCustomerService["getBillingStatus"]>;
    updateAutoTopUp(
        organizationId: string,
        enabled: boolean,
        threshold: number,
    ): ReturnType<BillingCustomerService["updateAutoTopUp"]>;
    checkCreditsGate(
        organizationId: string,
        runCount: number,
        architecture: ApplicationArchitecture,
        target?: BillingConsumptionTarget,
    ): Promise<void>;
    deductCreditsForGeneration(generationId: string, context?: DeductGenerationContext): Promise<boolean>;
    deductCreditsForRun(runId: string): Promise<boolean>;
    refundCreditsForGeneration(generationId: string): Promise<void>;
    grantSubscriptionCredits(organizationId: string, stripeInvoiceId: string): Promise<void>;
    grantTopupCredits(organizationId: string, stripePaymentIntentId: string): Promise<void>;
    revokeTopupCredits(
        organizationId: string,
        stripeRefundId: string,
        stripePaymentIntentId: string,
        refundedAmountCents: number,
        originalChargedAmountCents: number,
    ): Promise<void>;
    syncFromStripe(stripeCustomerId: string): ReturnType<BillingCustomerService["syncFromStripe"]>;
    findCustomerByStripeId(stripeCustomerId: string): ReturnType<BillingCustomerService["findCustomerByStripeId"]>;
    startGracePeriodByStripeCustomerId(stripeCustomerId: string, gracePeriodDays: number): Promise<void>;
    clearGracePeriodByStripeCustomerId(stripeCustomerId: string): Promise<void>;
    redeemPromoCode(organizationId: string, code: string): ReturnType<BillingPromoService["redeemPromoCode"]>;
}

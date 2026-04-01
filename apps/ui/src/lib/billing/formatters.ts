export const CHECKOUT_TYPE_SUBSCRIPTION = "subscription" as const;
export const CHECKOUT_TYPE_TOPUP = "topup" as const;

export type CheckoutType = typeof CHECKOUT_TYPE_SUBSCRIPTION | typeof CHECKOUT_TYPE_TOPUP;

export function formatSubscriptionStatus(status: string | undefined) {
    if (status == null) return "No subscription";

    switch (status) {
        case "active":
            return "Active";
        case "trialing":
            return "Trialing";
        case "past_due":
            return "Past due";
        case "unpaid":
            return "Unpaid";
        case "paused":
            return "Paused";
        case "incomplete":
            return "Incomplete";
        case "incomplete_expired":
            return "Incomplete expired";
        case "canceled":
            return "Canceled";
        default:
            return status;
    }
}

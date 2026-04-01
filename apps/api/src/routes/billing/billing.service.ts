import type { PrismaClient } from "@autonoma/db";
import { env } from "../../env.ts";
import { DisabledBillingService } from "./billing-disabled.service.ts";
import { EnabledBillingService } from "./billing-enabled.service.ts";
import type { BillingService } from "./billing-service.types.ts";

export type { BillingService } from "./billing-service.types.ts";

export function createBillingService(db: PrismaClient): BillingService {
    if (env.STRIPE_ENABLED) return new EnabledBillingService(db);
    return new DisabledBillingService(db);
}

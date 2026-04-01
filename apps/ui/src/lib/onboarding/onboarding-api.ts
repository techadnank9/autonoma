/**
 * Re-exports from the real tRPC-backed query hooks.
 * All onboarding API interactions go through lib/query/onboarding.queries.ts.
 */
export {
    useOnboardingState,
    usePollAgentConnected,
    usePollAgentLogs,
    useResetOnboarding,
    useSetNgrokUrl,
    useTestScenariosNgrok,
    useSetProductionUrl,
    useTestScenariosProduction,
    useCompleteOnboarding,
} from "lib/query/onboarding.queries";

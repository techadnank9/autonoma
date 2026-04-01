const ONBOARDING_NAMESPACE = "autonoma.onboarding";

export interface OnboardingDraftState {
    installConfirmed: boolean;
    configureConfirmed: boolean;
    sessionId: string | null;
    projectName: string;
    agentCompleted: boolean;
    scenariosVerified: boolean;
}

const DEFAULT_DRAFT: OnboardingDraftState = {
    installConfirmed: false,
    configureConfirmed: false,
    sessionId: null,
    projectName: "",
    agentCompleted: false,
    scenariosVerified: false,
};

function readLocalStorage(key: string) {
    if (typeof window === "undefined") {
        return null;
    }
    return window.localStorage.getItem(key);
}

function writeLocalStorage(key: string, value: string) {
    if (typeof window === "undefined") {
        return;
    }
    window.localStorage.setItem(key, value);
}

function removeLocalStorage(key: string) {
    if (typeof window === "undefined") {
        return;
    }
    window.localStorage.removeItem(key);
}

function completionKey(userId: string) {
    return `${ONBOARDING_NAMESPACE}.${userId}.completed`;
}

function draftKey(userId: string) {
    return `${ONBOARDING_NAMESPACE}.${userId}.draft`;
}

export function hasCompletedOnboarding(userId: string) {
    return readLocalStorage(completionKey(userId)) === "true";
}

export function markOnboardingCompleted(userId: string) {
    writeLocalStorage(completionKey(userId), "true");
}

export function clearOnboardingCompleted(userId: string) {
    removeLocalStorage(completionKey(userId));
}

export function getOnboardingDraft(userId: string): OnboardingDraftState {
    const raw = readLocalStorage(draftKey(userId));
    if (raw == null) {
        return { ...DEFAULT_DRAFT };
    }

    try {
        const parsed = JSON.parse(raw) as Partial<OnboardingDraftState>;
        return {
            installConfirmed: parsed.installConfirmed ?? false,
            configureConfirmed: parsed.configureConfirmed ?? false,
            sessionId: parsed.sessionId ?? null,
            projectName: parsed.projectName ?? "",
            agentCompleted: parsed.agentCompleted ?? false,
            scenariosVerified: parsed.scenariosVerified ?? false,
        };
    } catch {
        return { ...DEFAULT_DRAFT };
    }
}

export function patchOnboardingDraft(userId: string, patch: Partial<OnboardingDraftState>) {
    const next = { ...getOnboardingDraft(userId), ...patch };
    writeLocalStorage(draftKey(userId), JSON.stringify(next));
    return next;
}

export function clearOnboardingDraft(userId: string) {
    removeLocalStorage(draftKey(userId));
}

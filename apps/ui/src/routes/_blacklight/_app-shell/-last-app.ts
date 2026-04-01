const LAST_APP_KEY = "lastApplication";

export function getLastApp() {
    return localStorage.getItem(LAST_APP_KEY);
}

export function setLastApp(appSlug: string) {
    localStorage.setItem(LAST_APP_KEY, appSlug);
}

export function clearLastApp() {
    localStorage.removeItem(LAST_APP_KEY);
}

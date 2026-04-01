/**
 * Interface for platform-specific navigation.
 *
 * Implementations should handle navigation to URLs appropriate for the platform.
 * For web, this typically uses page.goto(). For mobile, this might use
 * deep links, intent launching, or other platform-specific mechanisms.
 */
export interface NavigationDriver {
    /**
     * Navigate to the specified URL.
     * @param url The URL to navigate to
     */
    navigate(url: string): Promise<void>;

    /**
     * Get the current URL.
     */
    getCurrentUrl(): Promise<string>;

    /**
     * Refresh the current page.
     */
    refresh(): Promise<void>;
}

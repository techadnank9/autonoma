export interface ApplicationDriver {
    /** Wait for the application to be stable */
    waitUntilStable(): Promise<void>;
}

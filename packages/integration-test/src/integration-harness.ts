/** Base integration test harness. */
export interface IntegrationHarness {
    /** Perform any necessary test-suite-wide setup */
    beforeAll(): Promise<void>;

    /** Perform any necessary test-suite-wide teardown */
    afterAll(): Promise<void>;

    /** Perform any necessary per-test setup */
    beforeEach(): Promise<void>;

    /** Perform any necessary per-test teardown */
    afterEach(): Promise<void>;
}

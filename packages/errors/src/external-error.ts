import { logger } from "@autonoma/logger";

/**
 * External errors are unexpected errors that we haven't yet identified.
 *
 * Eventually, all external errors should be properly classified.
 */
export class ExternalError extends Error {
    constructor(error: Error) {
        super(`Unexpected external error: ${error.message}`, { cause: error });
    }
}

export interface ExternalErrorConfig {
    /**
     * Avoid logging the error message when this error is thrown.
     */
    suppressLogging?: boolean;

    /**
     * The message to log when this error is thrown.
     */
    errorMessage?: string | null;

    /**
     * The wrapper function to wrap the original error.
     */
    wrapper?: (error: Error) => Error;
}

function externalErrorHandling(
    error: unknown,
    { errorMessage, suppressLogging, wrapper }: Required<ExternalErrorConfig>,
): Error {
    const wrapped = wrapper(
        error instanceof Error
            ? error
            : // If the error is not an Error, wrap it in a new Error with a generic message
              new Error(`Non-error value: ${String(error)}`),
    );

    if (errorMessage != null && !suppressLogging) {
        logger.error(errorMessage, { error: wrapped });
    }

    return wrapped;
}

/**
 * Handle external errors in a synchronous function.
 */
export function externalSync<T>(fn: () => T, config: ExternalErrorConfig = {}): T {
    const { suppressLogging = false, errorMessage = null, wrapper = (error) => error } = config;

    try {
        return fn();
    } catch (error) {
        throw externalErrorHandling(error, {
            suppressLogging,
            errorMessage,
            wrapper,
        });
    }
}

/**
 * Handle external errors in an asynchronous function.
 */
export async function external<T>(fn: () => Promise<T>, config: ExternalErrorConfig = {}): Promise<T> {
    const { suppressLogging = false, errorMessage = null, wrapper = (error) => error } = config;

    try {
        // Awaiting the function here is important, otherwise the try/catch block will not catch the error
        return await fn();
    } catch (error) {
        throw externalErrorHandling(error, {
            suppressLogging,
            errorMessage,
            wrapper,
        });
    }
}

/**
 * Create a wrapper over the externalSync and external functions, setting some config options.
 *
 * This is useful when you are wrapping many operations with the same config options.
 */
export function createExternalHandler(config: ExternalErrorConfig) {
    return {
        externalSync: <T>(fn: () => T) => externalSync(fn, config),
        external: <T>(fn: () => Promise<T>) => external(fn, config),
    };
}

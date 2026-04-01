export type Success<T> = [T, null];
export type Failure = [null, Error];
export type Try<T> = Success<T> | Failure;

function success<T>(value: T): Success<T> {
    return [value, null];
}

function failure(error: unknown): Failure {
    if (error instanceof Error) {
        return [null, error];
    }
    return [null, new Error(String(error))];
}

async function runAsync<T>(fn: () => Promise<T>): Promise<Try<T>> {
    try {
        const result = await fn();
        return success(result);
    } catch (error) {
        return failure(error);
    }
}

function run<T>(fn: () => T): Try<T> {
    try {
        const result = fn();
        return success(result);
    } catch (error) {
        return failure(error);
    }
}

function flatten<T>(tries: Try<T>[]): Try<T[]> {
    const results: T[] = [];
    for (const t of tries) {
        const [value, error] = t;
        if (error != null) return failure(error);
        results.push(value);
    }
    return success(results);
}

function filterFailures<T>(tries: Try<T>[]): T[] {
    const results: T[] = [];
    for (const t of tries) {
        const [value, error] = t;
        if (error == null) {
            results.push(value);
        }
    }
    return results;
}

export const fx = {
    success,
    failure,
    runAsync,
    run,
    flatten,
    filterFailures,
} as const;

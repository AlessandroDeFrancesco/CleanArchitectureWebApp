export type Result<OkType, ErrType> =
    | { type: 'ok'; value: OkType }
    | { type: 'error'; error: ErrType };

export function createResult<T, E>(value: T): Result<T, E> {
    return { type: 'ok', value };
}

export function createError<T, E>(error: E): Result<T, E> {
    return { type: 'error', error };
}

export function isOk<T, E>(res: Result<T, E>): res is { type: 'ok'; value: T } {
    return res.type === 'ok';
}

export function isError<T, E>(res: Result<T, E>): res is { type: 'error'; error: E } {
    return res.type === 'error';
}

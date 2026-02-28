export function errorToString(error) {
    try {
        if (error == null) {
            return '';
        }
        if (typeof error === 'string') {
            return error;
        }
        if (typeof error === 'number' || typeof error === 'boolean' || typeof error === 'bigint' || typeof error === 'symbol') {
            try {
                return String(error);
            }
            catch {
                return '';
            }
        }
        if (error instanceof Error) {
            const name = error.name && error.name !== 'Error' ? `${error.name}: ` : '';
            const message = (error.message || '').trim();
            const cause = error.cause;
            if (cause) {
                const cstr = errorToString(cause);
                if (cstr && cstr !== message) {
                    return `${name}${message || 'Error'}: ${cstr}`;
                }
            }
            return `${name}${message || 'Error'}`;
        }
        if (typeof error.message === 'string') {
            return error.message;
        }
        try {
            return JSON.stringify(error);
        }
        catch {
            try {
                return Object.prototype.toString.call(error);
            }
            catch {
                return 'Unknown error';
            }
        }
    }
    catch {
        try {
            return String(error);
        }
        catch {
            return 'Unknown error';
        }
    }
}
export function hasStringCode(error) {
    return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'string';
}
export function errorStringCode(error) {
    if (hasStringCode(error)) {
        return error.code;
    }
    return;
}
export function hasNumberCode(error) {
    return typeof error === 'object' && error !== null && 'code' in error && typeof error.code === 'number';
}
export function errorNumberCode(error) {
    if (hasNumberCode(error)) {
        return error.code;
    }
    return;
}
export function hasStatusCode(error) {
    return typeof error === 'object' && error !== null && 'statusCode' in error && typeof error.statusCode === 'number';
}
export function errorStatusCode(error) {
    if (hasStatusCode(error)) {
        return error.statusCode;
    }
    return;
}
//# sourceMappingURL=error.js.map
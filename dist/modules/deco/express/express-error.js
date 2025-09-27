export class ApiError extends Error {
    constructor(message, failCode) {
        super(message);
        this.name = this.constructor.name;
        this.failCode = failCode || 500;
    }
}
export const Errors = {
    itemNotFound: 'Item not found',
    invalidParameter: 'Invalid parameter',
    missingParameter: 'Missing parameter',
    internalError: 'Guru Meditation',
    unauthorized: 'Unauthorized'
};
export function missingParameterError(parameter) {
    return new ApiError(`${Errors.missingParameter}: ${parameter}`, 400);
}
export function invalidParameterError(parameter, message) {
    let value = `${Errors.invalidParameter}: ${parameter}`;
    if (message) {
        value += ` - ${message}`;
    }
    return new ApiError(value, 422);
}
export function notFoundError(message) {
    let value = Errors.itemNotFound;
    if (message) {
        value += `: ${message}`;
    }
    return new ApiError(value, 404);
}
export function unauthError(message) {
    let value = Errors.unauthorized;
    if (message) {
        value += `: ${message}`;
    }
    return new ApiError(value, 401);
}
export function genericError(message) {
    return new ApiError(message ?? 'Guru Meditation', 500);
}
//# sourceMappingURL=express-error.js.map
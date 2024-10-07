export class ApiError extends Error {
    constructor(message, failCode) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
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
export function MissingParamError(param) {
    return new ApiError(`${Errors.missingParameter}: ${param}`, 400);
}
export function InvalidParamError(param, msg) {
    return new ApiError(`${Errors.invalidParameter}: ${param}${msg ? ` - ${msg}` : ''}`, 422);
}
export function NotFoundError(msg) {
    return new ApiError(`${Errors.itemNotFound}${msg ? `: ${msg}` : ''}`, 404);
}
export function UnauthError(msg) {
    return new ApiError(`${Errors.unauthorized}${msg ? `: ${msg}` : ''}`, 401);
}
export function GenericError(msg) {
    return new ApiError(msg || 'Guru Meditation', 500);
}
//# sourceMappingURL=express-error.js.map
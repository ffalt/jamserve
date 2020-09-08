"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericError = exports.UnauthError = exports.NotFoundError = exports.InvalidParamError = exports.MissingParamError = exports.Errors = exports.ApiError = void 0;
class ApiError extends Error {
    constructor(message, failCode) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        this.failCode = failCode || 500;
    }
}
exports.ApiError = ApiError;
exports.Errors = {
    itemNotFound: 'Item not found',
    invalidParameter: 'Invalid parameter',
    missingParameter: 'Missing parameter',
    internalError: 'Guru Meditation',
    unauthorized: 'Unauthorized'
};
function MissingParamError(param) {
    return new ApiError(`${exports.Errors.missingParameter}: ${param}`, 400);
}
exports.MissingParamError = MissingParamError;
function InvalidParamError(param, msg) {
    return new ApiError(`${exports.Errors.invalidParameter}: ${param}${msg ? ` - ${msg}` : ''}`, 422);
}
exports.InvalidParamError = InvalidParamError;
function NotFoundError(msg) {
    return new ApiError(`${exports.Errors.itemNotFound}${msg ? `: ${msg}` : ''}`, 404);
}
exports.NotFoundError = NotFoundError;
function UnauthError(msg) {
    return new ApiError(`${exports.Errors.unauthorized}${msg ? `: ${msg}` : ''}`, 401);
}
exports.UnauthError = UnauthError;
function GenericError(msg) {
    return new ApiError(msg || 'Guru Meditation', 500);
}
exports.GenericError = GenericError;
//# sourceMappingURL=express-error.js.map
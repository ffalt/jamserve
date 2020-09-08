export class ApiError extends Error {
	failCode: number;

	constructor(message: string, failCode: number) {

		// Calling parent constructor of base Error class.
		super(message);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

		// Capturing stack trace, excluding constructor call from it.
		Error.captureStackTrace(this, this.constructor);

		// You can use any additional properties you want.
		// I'm going to use preferred HTTP status for this error types.
		// `500` is the default value if not specified.
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

export function MissingParamError(param: string): ApiError {
	return new ApiError(`${Errors.missingParameter}: ${param}`, 400);
}

export function InvalidParamError(param: string, msg?: string): ApiError {
	return new ApiError(`${Errors.invalidParameter}: ${param}${msg ? ` - ${msg}` : ''}`, 422);
}

export function NotFoundError(msg?: string): ApiError {
	return new ApiError(`${Errors.itemNotFound}${msg ? `: ${msg}` : ''}`, 404);
}

export function UnauthError(msg?: string): ApiError {
	return new ApiError(`${Errors.unauthorized}${msg ? `: ${msg}` : ''}`, 401);
}

export function GenericError(msg?: string): ApiError {
	return new ApiError(msg || 'Guru Meditation', 500);
}

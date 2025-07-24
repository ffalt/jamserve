export class ApiError extends Error {
	failCode: number;

	constructor(message: string, failCode: number) {
		// Calling parent constructor of base Error class.
		super(message);

		// Saving class name in the property of our custom error as a shortcut.
		this.name = this.constructor.name;

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

export function missingParamError(param: string): ApiError {
	return new ApiError(`${Errors.missingParameter}: ${param}`, 400);
}

export function invalidParamError(param: string, msg?: string): ApiError {
	let message = `${Errors.invalidParameter}: ${param}`;
	if (msg) {
		message += ` - ${msg}`;
	}
	return new ApiError(message, 422);
}

export function notFoundError(msg?: string): ApiError {
	let message = Errors.itemNotFound;
	if (msg) {
		message += `: ${msg}`;
	}
	return new ApiError(message, 404);
}

export function unauthError(msg?: string): ApiError {
	let message = Errors.unauthorized;
	if (msg) {
		message += `: ${msg}`;
	}
	return new ApiError(message, 401);
}

export function genericError(msg?: string): ApiError {
	return new ApiError(msg || 'Guru Meditation', 500);
}

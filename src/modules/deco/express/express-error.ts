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

export function missingParameterError(parameter: string): ApiError {
	return new ApiError(`${Errors.missingParameter}: ${parameter}`, 400);
}

export function invalidParameterError(parameter: string, message?: string): ApiError {
	let value = `${Errors.invalidParameter}: ${parameter}`;
	if (message) {
		value += ` - ${message}`;
	}
	return new ApiError(value, 422);
}

export function notFoundError(message?: string): ApiError {
	let value = Errors.itemNotFound;
	if (message) {
		value += `: ${message}`;
	}
	return new ApiError(value, 404);
}

export function unauthError(message?: string): ApiError {
	let value = Errors.unauthorized;
	if (message) {
		value += `: ${message}`;
	}
	return new ApiError(value, 401);
}

export function genericError(message?: string): ApiError {
	return new ApiError(message ?? 'Guru Meditation', 500);
}

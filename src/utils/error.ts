export function errorToString(error: unknown): string {
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
			} catch {
				return '';
			}
		}
		if (error instanceof Error) {
			const name = error.name && error.name !== 'Error' ? `${error.name}: ` : '';
			const message = (error.message || '').trim();
			// include cause if present and meaningful
			const cause: unknown = (error as any).cause;
			if (cause) {
				const cstr = errorToString(cause);
				if (cstr && cstr !== message) {
					return `${name}${message || 'Error'}: ${cstr}`;
				}
			}
			return `${name}${message || 'Error'}`;
		}
		// Objects that look like errors
		if (typeof (error as any).message === 'string') {
			return (error as any).message as string;
		}
		// Try JSON serialization
		try {
			return JSON.stringify(error);
		} catch {
			// Fall back to Object.prototype.toString
			try {
				return Object.prototype.toString.call(error);
			} catch {
				return 'Unknown error';
			}
		}
	} catch {
		try {
			return String(error);
		} catch {
			return 'Unknown error';
		}
	}
}

export function hasStringCode(error: unknown): error is { code: string } {
	return typeof error === 'object' && error !== null && 'code' in error && typeof (error as any).code === 'string';
}

export function errorStringCode(error: unknown): string | undefined {
	if (hasStringCode(error)) {
		return (error as any).code as string;
	}
	return;
}

export function hasNumberCode(error: unknown): error is { code: number } {
	return typeof error === 'object' && error !== null && 'code' in error && typeof (error as any).code === 'number';
}

export function errorNumberCode(error: unknown): number | undefined {
	if (hasNumberCode(error)) {
		return (error as any).code as number;
	}
	return;
}

export function hasstatusCode(error: unknown): error is { statusCode: number } {
	return typeof error === 'object' && error !== null && 'statusCode' in error && typeof (error as any).statusCode === 'number';
}

export function errorStatusCode(error: unknown): number | undefined {
	if (hasstatusCode(error)) {
		return (error as any).statusCode as number;
	}
	return;
}

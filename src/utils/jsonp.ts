// Validate callback to prevent XSS and prototype pollution via JSONP injection

export function validJSONP(callback?: string): boolean {
	if (!callback || callback.length === 0 || callback.length > 128) {
		return false;
	}
	// Allow only valid JavaScript identifiers: alphanumeric, underscore, and dollar sign (no dots)
	if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(callback)) {
		return false;
	}
	// Explicitly block dangerous prototype-related keywords
	const forbiddenCallbacks = ['constructor', 'prototype', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];
	return !forbiddenCallbacks.includes(callback);
}

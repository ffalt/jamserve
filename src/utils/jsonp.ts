// Validate callback to prevent XSS and prototype pollution via JSONP injection

export function validJSONP(callback?: string | Array<string>): boolean {
	// Normalize array to first element (HTTP params can be arrays)
	const normalizedCallback = Array.isArray(callback) ? callback.at(0) : callback;
	if (!normalizedCallback || normalizedCallback.length === 0 || normalizedCallback.length > 128) {
		return false;
	}
	// Allow only valid JavaScript identifiers: alphanumeric, underscore, and dollar sign (no dots)
	if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(normalizedCallback)) {
		return false;
	}
	// Explicitly block dangerous prototype-related keywords
	const forbiddenCallbacks = ['constructor', 'prototype', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];
	return !forbiddenCallbacks.includes(normalizedCallback);
}

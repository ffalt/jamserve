export function validJSONP(callback) {
    const normalizedCallback = Array.isArray(callback) ? callback.at(0) : callback;
    if (!normalizedCallback || normalizedCallback.length === 0 || normalizedCallback.length > 128) {
        return false;
    }
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(normalizedCallback)) {
        return false;
    }
    const forbiddenCallbacks = ['constructor', 'prototype', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];
    return !forbiddenCallbacks.includes(normalizedCallback);
}
//# sourceMappingURL=jsonp.js.map
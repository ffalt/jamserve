export function validJSONP(callback) {
    if (!callback || callback.length === 0 || callback.length > 128) {
        return false;
    }
    if (!/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(callback)) {
        return false;
    }
    const forbiddenCallbacks = ['constructor', 'prototype', '__proto__', '__defineGetter__', '__defineSetter__', '__lookupGetter__', '__lookupSetter__'];
    return !forbiddenCallbacks.includes(callback);
}
//# sourceMappingURL=jsonp.js.map
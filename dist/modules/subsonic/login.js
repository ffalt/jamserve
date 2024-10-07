import { ApiResponder } from './response.js';
import semver from 'semver';
import { SUBSONIC_VERSION } from './version.js';
import { SubsonicFormatter } from './formatter.js';
export function hexEncode(n) {
    const i = [];
    const r = [];
    const u = '0123456789abcdef';
    for (let t = 0; t < 256; t++) {
        i[t] = u.charAt(t >> 4) + u.charAt(t & 15);
    }
    for (let t = 0; t < n.length; t++) {
        r[t] = i[n.charCodeAt(t)];
    }
    return r.join('');
}
export function hexDecode(hex) {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
        str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return str.trim();
}
function sendError(req, res, error) {
    (new ApiResponder()).sendError(req, res, error);
}
async function validateCredentials(req) {
    if (req.user) {
        return req.user;
    }
    if (req.parameters.password) {
        let pass = req.parameters.password;
        if (typeof pass !== 'string') {
            return Promise.reject(SubsonicFormatter.ERRORS.PARAM_INVALID);
        }
        if (pass.startsWith('enc:')) {
            pass = hexDecode(pass.slice(4)).trim();
        }
        return req.engine.user.authSubsonicPassword(req.orm, req.parameters.username, pass);
    }
    if (req.parameters.token && req.parameters.salt) {
        return req.engine.user.authSubsonicToken(req.orm, req.parameters.username, req.parameters.token, req.parameters.salt);
    }
    return Promise.reject(SubsonicFormatter.ERRORS.PARAM_MISSING);
}
export function validateSubsonicParams(req, res) {
    if (!req.parameters || !req.parameters.client) {
        sendError(req, res, SubsonicFormatter.ERRORS.PARAM_MISSING);
        return false;
    }
    const version = semver.coerce(req.parameters.version);
    if (!version) {
        sendError(req, res, SubsonicFormatter.ERRORS.PARAM_MISSING);
        return false;
    }
    if (!semver.valid(version)) {
        sendError(req, res, SubsonicFormatter.ERRORS.PARAM_INVALID);
        return false;
    }
    if (semver.gt(version, SUBSONIC_VERSION)) {
        sendError(req, res, SubsonicFormatter.ERRORS.SERVER_OLD);
        return false;
    }
    if (semver.lt(version, '1.0.0')) {
        sendError(req, res, SubsonicFormatter.ERRORS.CLIENT_OLD);
        return false;
    }
    return true;
}
export async function subsonicLoginRateLimited(req, res, next) {
    req.client = req.parameters?.client;
    if (req.user) {
        return next();
    }
    const handled = await req.engine.rateLimit.loginSlowDown(req, res);
    if (handled) {
        return;
    }
    if (!validateSubsonicParams(req, res)) {
        return;
    }
    const user = await validateCredentials(req);
    if (user) {
        req.user = user;
        next();
        await req.engine.rateLimit.loginSlowDownReset(req);
    }
}
export function SubsonicLoginMiddleWare(req, res, next) {
    subsonicLoginRateLimited(req, res, next)
        .catch(e => {
        return (new ApiResponder()).sendError(req, res, e);
    });
}
export function SubsonicCheckAuthMiddleWare(req, res, next) {
    if (req.user) {
        return next();
    }
    return (new ApiResponder()).sendError(req, res, SubsonicFormatter.ERRORS.UNAUTH);
}
//# sourceMappingURL=login.js.map
import { ApiResponder } from './response.js';
import semver from 'semver';
import { SUBSONIC_VERSION } from './version.js';
import { SubsonicApiError, SubsonicFormatter } from './formatter.js';
import { hexDecode } from '../../utils/hex-decode.js';
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
            return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
        }
        if (pass.startsWith('enc:')) {
            pass = hexDecode(pass.slice(4)).trim();
        }
        return req.engine.user.authSubsonicPassword(req.orm, req.parameters.username, pass);
    }
    if (req.parameters.token && req.parameters.salt) {
        return req.engine.user.authSubsonicToken(req.orm, req.parameters.username, req.parameters.token, req.parameters.salt);
    }
    return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_MISSING));
}
export function validateSubsonicParameters(req, res) {
    if (!req.parameters?.client) {
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
        next();
        return;
    }
    const handled = await req.engine.rateLimit.loginSlowDown(req, res);
    if (handled) {
        return;
    }
    if (!validateSubsonicParameters(req, res)) {
        return;
    }
    const user = await validateCredentials(req);
    if (user) {
        req.user = user;
        await req.engine.rateLimit.loginSlowDownReset(req);
        next();
    }
    else {
        sendError(req, res, SubsonicFormatter.ERRORS.LOGIN_FAILED);
    }
}
export function SubsonicLoginMiddleWare(req, res, next) {
    subsonicLoginRateLimited(req, res, next)
        .catch((error) => {
        (new ApiResponder()).sendError(req, res, error);
    });
}
export function SubsonicCheckAuthMiddleWare(req, res, next) {
    if (req.user) {
        next();
        return;
    }
    (new ApiResponder()).sendError(req, res, SubsonicFormatter.ERRORS.UNAUTH);
}
//# sourceMappingURL=login.js.map
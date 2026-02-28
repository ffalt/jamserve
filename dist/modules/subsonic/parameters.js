import { validJSONP } from '../../utils/jsonp.js';
function processParameters(req) {
    const parameters = {
        username: req.query.u ?? '',
        password: req.query.p,
        format: req.query.f ?? 'xml',
        version: req.query.v ?? '',
        token: req.query.t,
        salt: req.query.s,
        client: req.query.c ?? '',
        callback: (() => {
            if (validJSONP(req.query.callback)) {
                return req.query.callback;
            }
            return undefined;
        })()
    };
    req.query.t = undefined;
    req.query.u = undefined;
    req.query.p = undefined;
    req.query.f = undefined;
    req.query.v = undefined;
    req.query.c = undefined;
    req.query.s = undefined;
    req.query.callback = undefined;
    return parameters;
}
export function SubsonicParameterMiddleWare(req, _res, next) {
    req.parameters = processParameters(req);
    next();
}
//# sourceMappingURL=parameters.js.map
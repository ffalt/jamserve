function processParams(req) {
    const params = {
        username: req.query.u || '',
        password: req.query.p,
        format: req.query.f || 'xml',
        version: req.query.v || '',
        token: req.query.t,
        salt: req.query.s,
        client: req.query.c || '',
        callback: req.query.callback
    };
    delete req.query.t;
    delete req.query.u;
    delete req.query.p;
    delete req.query.f;
    delete req.query.v;
    delete req.query.c;
    delete req.query.s;
    delete req.query.callback;
    return params;
}
export function SubsonicParameterMiddleWare(req, _res, next) {
    req.parameters = processParams(req);
    next();
}
//# sourceMappingURL=parameters.js.map
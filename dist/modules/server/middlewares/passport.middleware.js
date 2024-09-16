import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import passport from 'passport';
import { logger } from '../../../utils/logger.js';
import { hashMD5 } from '../../../utils/md5.js';
const log = logger('Passport');
function jwthash(token) {
    return hashMD5(token);
}
export function usePassPortMiddleWare(router, engine) {
    router.use(passport.initialize());
    router.use(passport.session());
    passport.serializeUser((user, done) => {
        done(null, user?.id || '_invalid_');
    });
    passport.deserializeUser((id, done) => {
        engine.user.findByID(engine.orm.fork(), id).then(user => done(null, user)).catch(done);
    });
    passport.use('local', new passportLocal.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
        engine.user.auth(engine.orm.fork(), username, password).then(user => done(null, user ? user : false)).catch(done);
    }));
    const resolvePayload = (jwtPayload, done) => {
        engine.user.authJWT(engine.orm.fork(), jwtPayload)
            .then(user => done(null, user ? user : false, jwtPayload))
            .catch(done);
    };
    passport.use('jwt-header', new passportJWT.Strategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: engine.config.env.jwt.secret
    }, resolvePayload));
    passport.use('jwt-parameter', new passportJWT.Strategy({
        jwtFromRequest: passportJWT.ExtractJwt.fromUrlQueryParameter('bearer'),
        secretOrKey: engine.config.env.jwt.secret
    }, resolvePayload));
    function jwtAuthMiddleware(req, res, next) {
        if (req.user) {
            return next();
        }
        let name = '';
        let token = req.header('Authorization');
        if (token) {
            token = token.slice(7);
            name = 'jwt-header';
        }
        else {
            token = req.query.bearer;
            if (token) {
                name = 'jwt-parameter';
            }
        }
        if (!token || !name) {
            return next();
        }
        const jwth = jwthash(token);
        req.engine.rateLimit.loginSlowDown(req, res)
            .then(() => {
            passport.authenticate(name, { session: false }, (err, user, info) => {
                if (err) {
                    log.error(err);
                    return next();
                }
                if (info instanceof Error || !user) {
                    return next();
                }
                req.engine.session.isRevoked(jwth)
                    .then(revoked => {
                    if (!revoked) {
                        req.jwt = !!user;
                        req.jwth = jwth;
                        req.client = info.client;
                        req.user = user;
                    }
                    next();
                    req.engine.rateLimit.loginSlowDownReset(req).catch(e => {
                        throw e;
                    });
                })
                    .catch(e => {
                    throw e;
                });
            })(req, res, next);
        })
            .catch(e => {
            throw e;
        });
    }
    return jwtAuthMiddleware;
}
//# sourceMappingURL=passport.middleware.js.map
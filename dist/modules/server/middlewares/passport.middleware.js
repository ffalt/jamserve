import passportJWT from 'passport-jwt';
import passportLocal from 'passport-local';
import passport from 'passport';
import { logger } from '../../../utils/logger.js';
import { jwtHash } from '../../../utils/jwt.js';
const log = logger('Passport');
function passPortAuth(name, next, req, jwth, res) {
    const result = passport.authenticate(name, { session: false }, (error, user, info) => {
        if (error) {
            log.error(error);
            next();
            return;
        }
        if (info instanceof Error || !user) {
            next();
            return;
        }
        req.engine.session.isRevoked(jwth)
            .then(revoked => {
            if (!revoked) {
                req.jwt = !!user;
                req.jwth = jwth;
                req.client = info?.client ?? 'unknown';
                req.user = user;
            }
            next();
            req.engine.rateLimit.loginSlowDownReset(req)
                .catch((error) => {
                throw error;
            });
        })
            .catch((error) => {
            throw error;
        });
    });
    void result(req, res, next);
}
export function usePassPortMiddleWare(router, engine) {
    router.use(passport.initialize());
    router.use(passport.session());
    passport.serializeUser((user, done) => {
        done(undefined, user?.id ?? '_invalid_');
    });
    passport.deserializeUser((id, done) => {
        engine.user.findByID(engine.orm.fork(), id)
            .then(user => {
            done(undefined, user);
        })
            .catch(done);
    });
    passport.use('local', new passportLocal.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
        engine.user.auth(engine.orm.fork(), username, password)
            .then((user) => {
            done(undefined, user ?? false);
        })
            .catch(done);
    }));
    const resolvePayload = (jwtPayload, done) => {
        engine.user.authJWT(engine.orm.fork(), jwtPayload)
            .then(user => {
            done(undefined, user ?? false, jwtPayload);
        })
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
            next();
            return;
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
            next();
            return;
        }
        const jwth = jwtHash(token);
        req.engine.rateLimit.loginSlowDown(req, res)
            .then(() => {
            passPortAuth(name, next, req, jwth, res);
        })
            .catch((error) => {
            throw error;
        });
    }
    return jwtAuthMiddleware;
}
//# sourceMappingURL=passport.middleware.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePassPortMiddleWare = void 0;
const passport_jwt_1 = __importDefault(require("passport-jwt"));
const passport_local_1 = __importDefault(require("passport-local"));
const passport_1 = __importDefault(require("passport"));
const hash_1 = require("../../../utils/hash");
const logger_1 = require("../../../utils/logger");
const log = logger_1.logger('Passport');
function jwthash(token) {
    return hash_1.hashMD5(token);
}
function usePassPortMiddleWare(router, engine) {
    router.use(passport_1.default.initialize());
    router.use(passport_1.default.session());
    passport_1.default.serializeUser((user, done) => {
        done(null, (user === null || user === void 0 ? void 0 : user.id) || '_invalid_');
    });
    passport_1.default.deserializeUser((id, done) => {
        engine.userService.findByID(id).then(user => done(null, user ? user : false)).catch(done);
    });
    passport_1.default.use('local', new passport_local_1.default.Strategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
        engine.userService.auth(username, password).then(user => done(null, user ? user : false)).catch(done);
    }));
    const resolvePayload = (jwtPayload, done) => {
        engine.userService.findByID(jwtPayload.id)
            .then(user => done(null, user ? user : false, jwtPayload))
            .catch(done);
    };
    passport_1.default.use('jwt-header', new passport_jwt_1.default.Strategy({
        jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: engine.configService.env.jwt.secret
    }, resolvePayload));
    passport_1.default.use('jwt-parameter', new passport_jwt_1.default.Strategy({
        jwtFromRequest: passport_jwt_1.default.ExtractJwt.fromUrlQueryParameter('bearer'),
        secretOrKey: engine.configService.env.jwt.secret
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
        passport_1.default.authenticate(name, { session: false }, (err, user, info) => {
            if (err) {
                log.error(err);
                return next();
            }
            if (info instanceof Error || !user) {
                return next();
            }
            req.engine.sessionService.isRevoked(jwth)
                .then(revoked => {
                if (!revoked) {
                    req.jwt = !!user;
                    req.jwth = jwth;
                    req.client = info.client;
                    req.user = user;
                }
                next();
            })
                .catch(e => {
                throw e;
            });
        })(req, res, next);
    }
    return jwtAuthMiddleware;
}
exports.usePassPortMiddleWare = usePassPortMiddleWare;
//# sourceMappingURL=passport.middleware.js.map
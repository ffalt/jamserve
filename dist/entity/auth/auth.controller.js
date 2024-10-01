var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var AuthController_1;
import { Session } from '../session/session.model.js';
import { BodyParams, Controller, Ctx, Post, UnauthError } from '../../modules/rest/index.js';
import passport from 'passport';
import { generateJWT, jwtHash } from '../../utils/jwt.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { CredentialsArgs } from './auth.args.js';
import { UserRole } from '../../types/enums.js';
import { logger } from '../../utils/logger.js';
const log = logger('AuthController');
let AuthController = AuthController_1 = class AuthController {
    async loginUser(req, res, next) {
        return new Promise((resolve, reject) => {
            passport.authenticate('local', (err, user) => {
                if (err || !user) {
                    log.error(err);
                    log.error(`Login failed for [${req.ip}]`);
                    return reject(UnauthError('Invalid Auth'));
                }
                req.login(user, (err2) => {
                    if (err2) {
                        log.error(err2);
                        log.error(`Login failed for [${req.ip}]`);
                        return reject(UnauthError('Invalid Auth'));
                    }
                    resolve(user);
                });
            })(req, res, next);
        });
    }
    async authenticate(credentials, req, res, next, engine) {
        const user = await this.loginUser(req, res, next);
        await engine.rateLimit.loginSlowDownReset(req);
        return AuthController_1.buildSessionResult(req, credentials, user, engine);
    }
    async login(credentials, { engine, req, res, next }) {
        return new Promise((resolve, reject) => {
            engine.rateLimit.loginSlowDown(req, res)
                .then(handled => {
                if (!handled) {
                    this.authenticate(credentials, req, res, next, engine)
                        .then(session => {
                        resolve(session);
                    })
                        .catch(e => {
                        reject(e);
                    });
                }
            })
                .catch(e => {
                reject(e);
            });
        });
    }
    static buildSessionResult(req, credentials, user, engine) {
        const client = req.body.client || 'Unknown Client';
        const token = credentials.jwt ? generateJWT(user.id, client, engine.config.env.jwt.secret, engine.config.env.jwt.maxAge) : undefined;
        if (req.session) {
            const session = req.session;
            session.client = client;
            session.userAgent = req.headers['user-agent'] || client;
            if (token) {
                session.jwth = jwtHash(token);
            }
        }
        return {
            allowedCookieDomains: engine.config.env.session.allowedCookieDomains,
            version: JAMAPI_VERSION,
            jwt: token,
            user: {
                id: user.id,
                name: user.name,
                roles: {
                    admin: user.roleAdmin,
                    podcast: user.rolePodcast,
                    stream: user.roleStream,
                    upload: user.roleUpload
                }
            }
        };
    }
    async logout({ req }) {
        return new Promise(resolve => {
            req.logout(resolve);
        });
    }
};
__decorate([
    Post('/login', () => Session, { description: 'Start session or jwt access', summary: 'Login' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CredentialsArgs, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Post('/logout', { roles: [UserRole.stream], description: 'End session or jwt access', summary: 'Logout' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = AuthController_1 = __decorate([
    Controller('/auth', { tags: ['Access'] })
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map
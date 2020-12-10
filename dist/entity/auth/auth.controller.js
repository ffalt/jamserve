"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const session_model_1 = require("../session/session.model");
const rest_1 = require("../../modules/rest");
const passport_1 = __importDefault(require("passport"));
const jwt_1 = require("../../utils/jwt");
const version_1 = require("../../modules/engine/rest/version");
const auth_args_1 = require("./auth.args");
const enums_1 = require("../../types/enums");
const logger_1 = require("../../utils/logger");
const log = logger_1.logger('AuthController');
let AuthController = class AuthController {
    async loginUser(req, res, next) {
        return new Promise((resolve, reject) => {
            passport_1.default.authenticate('local', (err, user) => {
                if (err || !user) {
                    log.error(err);
                    return reject(rest_1.UnauthError('Invalid Auth'));
                }
                req.login(user, (err2) => {
                    if (err2) {
                        log.error(err2);
                        console.error(err2);
                        return reject(rest_1.UnauthError('Invalid Auth'));
                    }
                    resolve(user);
                });
            })(req, res, next);
        });
    }
    async authenticate(credentials, req, res, next, engine) {
        const user = await this.loginUser(req, res, next);
        await engine.rateLimit.loginSlowDownReset(req);
        return this.buildSessionResult(req, credentials, user, engine);
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
    buildSessionResult(req, credentials, user, engine) {
        const client = req.body.client || 'Unknown Client';
        const token = credentials.jwt ? jwt_1.generateJWT(user.id, client, engine.config.env.jwt.secret, engine.config.env.jwt.maxAge) : undefined;
        if (req.session) {
            const session = req.session;
            session.client = client;
            session.userAgent = req.headers['user-agent'] || client;
            if (token) {
                session.jwth = jwt_1.jwtHash(token);
            }
        }
        return {
            allowedCookieDomains: engine.config.env.session.allowedCookieDomains,
            version: version_1.JAMAPI_VERSION,
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
    logout({ req }) {
        req.logout();
    }
};
__decorate([
    rest_1.Post('/login', () => session_model_1.Session, { description: 'Start session or jwt access', summary: 'Login' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_args_1.CredentialsArgs, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    rest_1.Post('/logout', { roles: [enums_1.UserRole.stream], description: 'End session or jwt access', summary: 'Logout' }),
    __param(0, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    rest_1.Controller('/auth', { tags: ['Access'] })
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map
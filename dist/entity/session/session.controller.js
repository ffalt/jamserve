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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionController = void 0;
const session_model_1 = require("./session.model");
const config_service_1 = require("../../modules/engine/services/config.service");
const typescript_ioc_1 = require("typescript-ioc");
const decorators_1 = require("../../modules/rest/decorators");
const user_1 = require("../user/user");
const version_1 = require("../../modules/engine/rest/version");
const user_session_model_1 = require("../settings/user-session.model");
const enums_1 = require("../../types/enums");
const session_service_1 = require("../settings/session.service");
const transform_service_1 = require("../../modules/engine/services/transform.service");
let SessionController = class SessionController {
    session(user) {
        let sessionUser;
        if (user) {
            sessionUser = {
                id: user.id,
                name: user.name,
                roles: {
                    admin: user.roleAdmin,
                    podcast: user.rolePodcast,
                    stream: user.roleStream,
                    upload: user.roleUpload
                }
            };
        }
        return {
            allowedCookieDomains: this.configService.env.session.allowedCookieDomains,
            version: version_1.JAMAPI_VERSION,
            user: sessionUser
        };
    }
    async list(user) {
        const sessions = await this.sessionService.byUserID(user.id);
        return sessions.map(session => this.transform.userSession(session));
    }
    async remove(id, user) {
        await this.sessionService.removeUserSession(id, user.id);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], SessionController.prototype, "configService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", session_service_1.SessionService)
], SessionController.prototype, "sessionService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", transform_service_1.TransformService)
], SessionController.prototype, "transform", void 0);
__decorate([
    decorators_1.Get(() => session_model_1.Session, { description: 'Check the Login State', summary: 'Check Session' }),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", session_model_1.Session)
], SessionController.prototype, "session", null);
__decorate([
    decorators_1.Get('/list', () => [user_session_model_1.UserSession], { roles: [enums_1.UserRole.stream], description: 'Get a list of all sessions of the current user', summary: 'Get Sessions' }),
    __param(0, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_1.User]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "list", null);
__decorate([
    decorators_1.Post('/remove', { roles: [enums_1.UserRole.stream], description: 'Remove a user session', summary: 'Remove Session' }),
    __param(0, decorators_1.BodyParam('id', { description: 'User Session Id', isID: true })),
    __param(1, decorators_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_1.User]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "remove", null);
SessionController = __decorate([
    decorators_1.Controller('/session', { tags: ['Access'] })
], SessionController);
exports.SessionController = SessionController;
//# sourceMappingURL=session.controller.js.map
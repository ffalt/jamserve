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
import { Session } from './session.model.js';
import { BodyParam, Controller, Ctx, Get, Post } from '../../modules/rest/index.js';
import { JAMAPI_VERSION } from '../../modules/engine/rest/version.js';
import { UserSession } from './user-session.model.js';
import { UserRole } from '../../types/enums.js';
let SessionController = class SessionController {
    session({ engine, user }) {
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
            allowedCookieDomains: engine.config.env.session.allowedCookieDomains,
            version: JAMAPI_VERSION,
            user: sessionUser
        };
    }
    async list({ orm, engine, user }) {
        const sessions = await engine.session.byUserID(user.id);
        return sessions.map(session => engine.transform.Session.userSession(orm, session));
    }
    async remove(id, { engine, user }) {
        await engine.session.removeUserSession(id, user.id);
    }
};
__decorate([
    Get(() => Session, { description: 'Check the Login State', summary: 'Check Session' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Session)
], SessionController.prototype, "session", null);
__decorate([
    Get('/list', () => [UserSession], { roles: [UserRole.stream], description: 'Get a list of all sessions of the current user', summary: 'Get Sessions' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "list", null);
__decorate([
    Post('/remove', { roles: [UserRole.stream], description: 'Remove a user session', summary: 'Remove Session' }),
    __param(0, BodyParam('id', { description: 'User Session Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SessionController.prototype, "remove", null);
SessionController = __decorate([
    Controller('/session', { tags: ['Access'] })
], SessionController);
export { SessionController };
//# sourceMappingURL=session.controller.js.map
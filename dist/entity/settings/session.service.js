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
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionService = void 0;
const orm_service_1 = require("../../modules/engine/services/orm.service");
const enums_1 = require("../../types/enums");
const typescript_ioc_1 = require("typescript-ioc");
const orm_1 = require("../../modules/orm");
let SessionService = class SessionService {
    constructor() {
        this.events = [];
        this.jwthCache = [];
    }
    expired(data) {
        return data.expires < Date.now();
    }
    async exists(sessionID) {
        return !!(await this.getSession(sessionID));
    }
    async set(sid, data) {
        var _a;
        const orm = this.ormService.fork();
        let session = await this.getSession(sid);
        if (!data.passport.user) {
            if (session) {
                await orm.Session.removeAndFlush(session);
            }
            return;
        }
        if (!session) {
            session = orm.Session.create({ sessionID: sid });
        }
        session.jwth = data.jwth;
        session.agent = data.userAgent;
        session.client = data.client;
        session.cookie = JSON.stringify(data.cookie);
        session.mode = data.jwth ? enums_1.SessionMode.jwt : enums_1.SessionMode.browser;
        if (session.user.id() !== data.passport.user) {
            await session.user.set(await orm.User.oneOrFailByID(data.passport.user));
        }
        session.expires = typeof data.cookie.expires === 'boolean' ?
            (data.cookie.expires ? Date.now() : 0) :
            (((_a = data.cookie.expires) === null || _a === void 0 ? void 0 : _a.valueOf()) || 0);
        await orm.Session.persistAndFlush(session);
    }
    async all() {
        const orm = this.ormService.fork();
        const sessions = await orm.Session.all();
        return sessions.map(session => this.toExpress(session));
    }
    async getSession(sessionID) {
        const orm = this.ormService.fork();
        const session = await orm.Session.findOne({ where: { sessionID } });
        if (session && this.expired(session)) {
            await this.remove(sessionID);
            return;
        }
        return session || undefined;
    }
    async clearExpired() {
        const orm = this.ormService.fork();
        await orm.Session.removeByQueryAndFlush({ where: { expires: { [orm_1.Op.lt]: Date.now() } } });
    }
    async byJwth(jwth) {
        const orm = this.ormService.fork();
        return (await orm.Session.findOne({ where: { jwth } }));
    }
    async byUserID(userID) {
        const orm = this.ormService.fork();
        return await orm.Session.find({ where: { user: userID } });
    }
    async byID(id) {
        const orm = this.ormService.fork();
        return await orm.Session.findOneByID(id);
    }
    async remove(sessionID) {
        this.jwthCache = [];
        const orm = this.ormService.fork();
        await orm.Session.removeByQueryAndFlush({ where: { sessionID } });
    }
    async removeUserSession(id, userID) {
        this.jwthCache = [];
        const orm = this.ormService.fork();
        await orm.Session.removeByQueryAndFlush({ where: { id, user: userID } });
    }
    async removeByJwth(jwth) {
        this.jwthCache = [];
        const orm = this.ormService.fork();
        await orm.Session.removeByQueryAndFlush({ where: { jwth } });
    }
    async clear() {
        this.jwthCache = [];
        const orm = this.ormService.fork();
        await orm.Session.removeByQueryAndFlush({});
    }
    async count() {
        const orm = this.ormService.fork();
        return orm.Session.count();
    }
    async clearCache() {
        this.jwthCache = [];
        for (const notify of this.events) {
            await notify.clearCache();
        }
    }
    registerNotify(notify) {
        this.events.push(notify);
    }
    async isRevoked(jwth) {
        if (this.jwthCache.includes(jwth)) {
            return false;
        }
        const session = await this.byJwth(jwth);
        if (session) {
            this.jwthCache.push(jwth);
        }
        return !session;
    }
    async get(sessionID) {
        const session = await this.getSession(sessionID);
        if (session) {
            return this.toExpress(session);
        }
    }
    toExpress(session) {
        return {
            cookie: JSON.parse(session.cookie),
            client: session.client,
            jwth: session.jwth,
            userAgent: session.agent,
            passport: { user: session.user.idOrFail() }
        };
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], SessionService.prototype, "ormService", void 0);
SessionService = __decorate([
    typescript_ioc_1.InRequestScope
], SessionService);
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map
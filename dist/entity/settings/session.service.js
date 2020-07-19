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
        let session = await this.getSession(sid);
        if (!data.passport.user) {
            if (session) {
                await this.orm.Session.removeAndFlush(session);
            }
            return;
        }
        if (!session) {
            session = this.orm.Session.create({ sessionID: sid });
        }
        session.jwth = data.jwth;
        session.agent = data.userAgent;
        session.client = data.client;
        session.cookie = JSON.stringify(data.cookie);
        session.mode = data.jwth ? enums_1.SessionMode.jwt : enums_1.SessionMode.browser;
        if (!session.user || session.user.id !== data.passport.user) {
            session.user = await this.orm.User.oneOrFail(data.passport.user);
        }
        session.expires = typeof data.cookie.expires === 'boolean' ?
            (data.cookie.expires ? Date.now() : 0) :
            (((_a = data.cookie.expires) === null || _a === void 0 ? void 0 : _a.valueOf()) || 0);
        await this.orm.Session.persistAndFlush(session);
    }
    async all() {
        const sessions = await this.orm.Session.all();
        return sessions.map(session => this.toExpress(session));
    }
    async getSession(sessionID) {
        const session = await this.orm.Session.findOne({ sessionID: { $eq: sessionID } });
        if (session && this.expired(session)) {
            await this.remove(sessionID);
            return;
        }
        return session || undefined;
    }
    async clearExpired() {
        await this.orm.Session.remove({ expires: { $lt: Date.now() } });
    }
    async byJwth(jwth) {
        return (await this.orm.Session.findOne({ jwth: { $eq: jwth } })) || undefined;
    }
    async byUserID(userID) {
        return await this.orm.Session.find({ user: { id: userID } });
    }
    async byID(id) {
        return await this.orm.Session.findOne(id) || undefined;
    }
    async remove(sessionID) {
        this.jwthCache = [];
        await this.orm.Session.remove({ sessionID: { $eq: sessionID } });
    }
    async removeUserSession(id, userID) {
        this.jwthCache = [];
        await this.orm.Session.remove({ id: id, user: { id: userID } });
    }
    async removeByJwth(jwth) {
        this.jwthCache = [];
        await this.orm.Session.remove({ jwth: { $eq: jwth } });
    }
    async clear() {
        this.jwthCache = [];
        await this.orm.Session.remove({});
    }
    async count() {
        return this.orm.Session.count();
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
            passport: { user: session.user.id }
        };
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], SessionService.prototype, "orm", void 0);
SessionService = __decorate([
    typescript_ioc_1.Singleton
], SessionService);
exports.SessionService = SessionService;
//# sourceMappingURL=session.service.js.map
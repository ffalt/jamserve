var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SessionService_1;
import { OrmService } from '../../modules/engine/services/orm.service.js';
import { SessionMode } from '../../types/enums.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import seq from 'sequelize';
import { randomString } from '../../utils/random.js';
let SessionService = SessionService_1 = class SessionService {
    constructor() {
        this.events = [];
        this.jwthCache = [];
    }
    expired(data) {
        return data.expires ? (data.expires < new Date()) : false;
    }
    async exists(sessionID) {
        return !!(await this.getSession(sessionID));
    }
    async set(sid, data) {
        const orm = this.ormService.fork();
        let session = await this.getSession(sid);
        if (!data.passport || !data.passport.user) {
            if (session) {
                await orm.Session.removeAndFlush(session);
            }
            return;
        }
        if (!session) {
            session = orm.Session.create({ sessionID: sid });
        }
        session.jwth = data.jwth;
        session.agent = data.userAgent || '';
        session.client = data.client || '';
        session.cookie = JSON.stringify(data.cookie);
        session.mode = data.jwth ? SessionMode.jwt : SessionMode.browser;
        if (session.user.id() !== data.passport.user) {
            await session.user.set(await orm.User.oneOrFailByID(data.passport.user));
        }
        session.expires = typeof data.cookie.expires === 'boolean' ?
            (data.cookie.expires ? new Date() : undefined) :
            (data.cookie.expires === null ? undefined : data.cookie.expires);
        await orm.Session.persistAndFlush(session);
    }
    async all() {
        const orm = this.ormService.fork();
        const sessions = await orm.Session.all();
        return sessions.map(session => SessionService_1.toExpress(session));
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
        await orm.Session.removeByQueryAndFlush({ where: { expires: { [seq.Op.lt]: Date.now() } } });
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
            return SessionService_1.toExpress(session);
        }
        return;
    }
    static toExpress(session) {
        return {
            cookie: JSON.parse(session.cookie),
            client: session.client,
            jwth: session.jwth,
            userAgent: session.agent,
            sessionID: session.sessionID,
            passport: { user: session.user.idOrFail() }
        };
    }
    async createSubsonic(userID) {
        const orm = this.ormService.fork();
        let session = (await orm.Session.findOne({ where: { user: userID, mode: SessionMode.subsonic } }));
        if (!session) {
            session = orm.Session.create({
                client: 'Subsonic Client',
                mode: SessionMode.subsonic,
                sessionID: `${userID}_subsonic`,
                agent: 'Subsonic Client',
                cookie: '{}'
            });
        }
        const user = await orm.User.findOneOrFailByID(userID);
        await session.user.set(user);
        session.jwth = randomString(16);
        await orm.Session.persist(session, true);
        return session;
    }
};
__decorate([
    Inject,
    __metadata("design:type", OrmService)
], SessionService.prototype, "ormService", void 0);
SessionService = SessionService_1 = __decorate([
    InRequestScope
], SessionService);
export { SessionService };
//# sourceMappingURL=session.service.js.map
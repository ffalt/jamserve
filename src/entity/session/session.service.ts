import {OrmService} from '../../modules/engine/services/orm.service';
import {Session} from './session';
import {SessionMode} from '../../types/enums';
import {Express} from 'express';
import {Inject, InRequestScope} from 'typescript-ioc';
import {Op} from '../../modules/orm';

export interface SessionNotifyEventObject {
	clearCache(): Promise<void>;
}

@InRequestScope
export class SessionService {
	@Inject
	private ormService!: OrmService;
	private events: Array<SessionNotifyEventObject> = [];
	private jwthCache: Array<string> = [];

	expired(data: Session): boolean {
		return data.expires ? (data.expires < new Date()) : false;
	}

	async exists(sessionID: string): Promise<boolean> {
		return !!(await this.getSession(sessionID));
	}

	async set(sid: string, data: Express.SessionData): Promise<void> {
		const orm = this.ormService.fork();
		let session = await this.getSession(sid);
		if (!data.passport.user) {
			if (session) {
				await orm.Session.removeAndFlush(session);
			}
			return;
		}
		if (!session) {
			session = orm.Session.create({sessionID: sid});
		}
		session.jwth = data.jwth;
		session.agent = data.userAgent;
		session.client = data.client;
		session.cookie = JSON.stringify(data.cookie);
		session.mode = data.jwth ? SessionMode.jwt : SessionMode.browser;
		if (session.user.id() !== data.passport.user) {
			await session.user.set(await orm.User.oneOrFailByID(data.passport.user));
		}
		session.expires = typeof data.cookie.expires === 'boolean' ?
			(data.cookie.expires ? new Date() : undefined) : data.cookie.expires;
		await orm.Session.persistAndFlush(session);
	}

	async all(): Promise<Array<Express.SessionData>> {
		const orm = this.ormService.fork();
		const sessions = await orm.Session.all();
		return sessions.map(session => this.toExpress(session));
	}

	async getSession(sessionID: string): Promise<Session | undefined> {
		const orm = this.ormService.fork();
		const session = await orm.Session.findOne({where: {sessionID}});
		if (session && this.expired(session)) {
			await this.remove(sessionID);
			return;
		}
		return session || undefined;
	}

	async clearExpired(): Promise<void> {
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({where: {expires: {[Op.lt]: Date.now()}}});
	}

	async byJwth(jwth: string): Promise<Session | undefined> {
		const orm = this.ormService.fork();
		return (await orm.Session.findOne({where: {jwth}}));
	}

	async byUserID(userID: string): Promise<Array<Session>> {
		const orm = this.ormService.fork();
		return await orm.Session.find({where: {user: userID}});
	}

	async byID(id: string): Promise<Session | undefined> {
		const orm = this.ormService.fork();
		return await orm.Session.findOneByID(id);
	}

	async remove(sessionID: string): Promise<void> {
		this.jwthCache = [];
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({where: {sessionID}});
	}

	async removeUserSession(id: string, userID: string): Promise<void> {
		this.jwthCache = [];
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({where: {id, user: userID}});
	}

	async removeByJwth(jwth: string): Promise<void> {
		this.jwthCache = [];
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({where: {jwth}});
	}

	async clear(): Promise<void> {
		this.jwthCache = [];
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({});
	}

	async count(): Promise<number> {
		const orm = this.ormService.fork();
		return orm.Session.count();
	}

	async clearCache(): Promise<void> {
		this.jwthCache = [];
		for (const notify of this.events) {
			await notify.clearCache();
		}
	}

	registerNotify(notify: SessionNotifyEventObject): void {
		this.events.push(notify);
	}

	async isRevoked(jwth: string): Promise<boolean> {
		if (this.jwthCache.includes(jwth)) {
			return false;
		}
		const session = await this.byJwth(jwth);
		if (session) {
			this.jwthCache.push(jwth);
		}
		return !session;
	}

	async get(sessionID: string): Promise<Express.SessionData | undefined> {
		const session = await this.getSession(sessionID);
		if (session) {
			return this.toExpress(session);
		}
	}

	private toExpress(session: Session): Express.SessionData {
		return {
			cookie: JSON.parse(session.cookie),
			client: session.client,
			jwth: session.jwth,
			userAgent: session.agent,
			passport: {user: session.user.idOrFail()}
		};
	}

}

import {OrmService} from '../../modules/engine/services/orm.service';
import {Session} from '../session/session';
import {SessionMode} from '../../types/enums';
import {Express} from 'express';
import {Inject, Singleton} from 'typescript-ioc';

export interface SessionNotifyEventObject {
	clearCache(): Promise<void>;
}

@Singleton
export class SessionService {
	@Inject
	private orm!: OrmService
	private events: Array<SessionNotifyEventObject> = [];
	private jwthCache: Array<string> = [];

	expired(data: Session): boolean {
		return data.expires < Date.now();
	}

	async exists(sessionID: string): Promise<boolean> {
		return !!(await this.getSession(sessionID));
	}

	async set(sid: string, data: Express.SessionData): Promise<void> {
		let session = await this.getSession(sid);
		if (!data.passport.user) {
			if (session) {
				await this.orm.Session.removeAndFlush(session);
			}
			return;
		}
		if (!session) {
			session = this.orm.Session.create({sessionID: sid});
		}
		session.jwth = data.jwth;
		session.agent = data.userAgent;
		session.client = data.client;
		session.cookie = JSON.stringify(data.cookie);
		session.mode = data.jwth ? SessionMode.jwt : SessionMode.browser;
		if (!session.user || session.user.id !== data.passport.user) {
			session.user = await this.orm.User.oneOrFail(data.passport.user)
		}
		session.expires = typeof data.cookie.expires === 'boolean' ?
			(data.cookie.expires ? Date.now() : 0) :
			(data.cookie.expires?.valueOf() || 0);
		await this.orm.Session.persistAndFlush(session);
	}

	async all(): Promise<Array<Express.SessionData>> {
		const sessions = await this.orm.Session.all();
		return sessions.map(session => this.toExpress(session));
	}

	async getSession(sessionID: string): Promise<Session | undefined> {
		const session = await this.orm.Session.findOne({sessionID: {$eq: sessionID}});
		if (session && this.expired(session)) {
			await this.remove(sessionID);
			return;
		}
		return session || undefined;
	}


	async clearExpired(): Promise<void> {
		await this.orm.Session.remove({expires: {$lt: Date.now()}});
	}

	async byJwth(jwth: string): Promise<Session | undefined> {
		return (await this.orm.Session.findOne({jwth: {$eq: jwth}})) || undefined;
	}

	async byUserID(userID: string): Promise<Array<Session>> {
		return await this.orm.Session.find({user: {id: userID}});
	}

	async byID(id: string): Promise<Session | undefined> {
		return await this.orm.Session.findOne(id) || undefined;
	}

	async remove(sessionID: string): Promise<void> {
		this.jwthCache = [];
		await this.orm.Session.remove({sessionID: {$eq: sessionID}});
	}

	async removeUserSession(id: string, userID: string): Promise<void> {
		this.jwthCache = [];
		await this.orm.Session.remove({id: id, user: {id: userID}});
	}

	async removeByJwth(jwth: string): Promise<void> {
		this.jwthCache = [];
		await this.orm.Session.remove({jwth: {$eq: jwth}});
	}

	async clear(): Promise<void> {
		this.jwthCache = [];
		await this.orm.Session.remove({});
	}

	async count(): Promise<number> {
		return this.orm.Session.count();
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
			passport: {user: session.user.id}
		};
	}

}

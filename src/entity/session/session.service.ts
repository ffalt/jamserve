import { OrmService } from '../../modules/engine/services/orm.service.js';
import { Session } from './session.js';
import { SessionMode } from '../../types/enums.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import seq from 'sequelize';
import { SessionData } from '../../types/express.js';
import { randomString } from '../../utils/random.js';

export interface SessionNotifyEventObject {
	clearCache(): Promise<void>;
}

@InRequestScope
export class SessionService {
	@Inject
	private readonly ormService!: OrmService;

	private readonly events: Array<SessionNotifyEventObject> = [];
	private jwthCache: Array<string> = [];

	expired(data: Session): boolean {
		return data.expires ? (data.expires < new Date()) : false;
	}

	async exists(sessionID: string): Promise<boolean> {
		return !!(await this.getSession(sessionID));
	}

	async set(sid: string, data: SessionData): Promise<void> {
		const orm = this.ormService.fork();
		let session = await this.getSession(sid);
		if (!data.passport?.user) {
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
		let expires: Date | undefined;
		if (typeof data.cookie.expires === 'boolean') {
			expires = data.cookie.expires ? new Date() : undefined;
		} else {
			expires = data.cookie.expires ?? undefined;
		}
		session.expires = expires;
		await orm.Session.persistAndFlush(session);
	}

	async all(): Promise<Array<SessionData>> {
		const orm = this.ormService.fork();
		const sessions = await orm.Session.all();
		return sessions.map(session => SessionService.toExpress(session));
	}

	async getSession(sessionID: string): Promise<Session | undefined> {
		const orm = this.ormService.fork();
		const session = await orm.Session.findOne({ where: { sessionID } });
		if (session && this.expired(session)) {
			await this.remove(sessionID);
			return;
		}
		return session || undefined;
	}

	async clearExpired(): Promise<void> {
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({ where: { expires: { [seq.Op.lt]: Date.now() } } });
	}

	async byJwth(jwth: string): Promise<Session | undefined> {
		const orm = this.ormService.fork();
		return (await orm.Session.findOne({ where: { jwth } }));
	}

	async byUserID(userID: string): Promise<Array<Session>> {
		const orm = this.ormService.fork();
		return await orm.Session.find({ where: { user: userID } });
	}

	async byID(id: string): Promise<Session | undefined> {
		const orm = this.ormService.fork();
		return await orm.Session.findOneByID(id);
	}

	async remove(sessionID: string): Promise<void> {
		this.jwthCache = [];
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({ where: { sessionID } });
	}

	async removeUserSession(id: string, userID: string): Promise<void> {
		this.jwthCache = [];
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({ where: { id, user: userID } });
	}

	async removeByJwth(jwth: string): Promise<void> {
		this.jwthCache = [];
		const orm = this.ormService.fork();
		await orm.Session.removeByQueryAndFlush({ where: { jwth } });
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

	async get(sessionID: string): Promise<SessionData | undefined> {
		const session = await this.getSession(sessionID);
		if (session) {
			return SessionService.toExpress(session);
		}
		return;
	}

	private static toExpress(session: Session): SessionData {
		return {
			cookie: JSON.parse(session.cookie),
			client: session.client,
			jwth: session.jwth,
			userAgent: session.agent,
			sessionID: session.sessionID,
			passport: { user: session.user.idOrFail() }
		};
	}

	async createSubsonic(userID: string): Promise<Session> {
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
		await orm.Session.persistAndFlush(session);
		return session;
	}
}

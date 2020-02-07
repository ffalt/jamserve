import {Express} from 'express';
import {Store} from 'express-session';
import {DBObjectType} from '../../db/db.types';
import {Session} from '../../engine/session/session.model';
import {SessionNotifyEventObject, SessionService} from '../../engine/session/session.service';
import {SessionMode} from '../../engine/session/session.types';

interface ExpressSession extends Express.SessionData {
	passport: { user: string };
	jwth: string;
	client: string;
	userAgent: string;
}

export class ExpressSessionStore extends Store implements SessionNotifyEventObject {
	private cache = new Map<string, ExpressSession>();

	constructor(public sessionService: SessionService) {
		super();
		sessionService.registerNotify(this); // TODO: better notify system in node? use RX?
	}

	async clearCache(): Promise<void> {
		this.cache.clear();
	}

	private expired(data: ExpressSession): boolean {
		return (data.cookie.expires || 0) < Date.now();
	}

	private toJam(sessionID: string, session: ExpressSession): Session {
		return {
			id: '',
			sessionID,
			jwth: session.jwth,
			agent: session.userAgent,
			mode: session.jwth ? SessionMode.jwt : SessionMode.browser,
			client: session.client,
			cookie: JSON.stringify(session.cookie),
			type: DBObjectType.session,
			userID: session.passport.user,
			expires: session.cookie.expires.valueOf() as number
		};
	}

	private toExpress(session: Session): ExpressSession {
		return {
			cookie: JSON.parse(session.cookie),
			client: session.client,
			jwth: session.jwth,
			userAgent: session.agent,
			passport: {user: session.userID}
		};
	}

	private async _get(sid: string): Promise<ExpressSession | undefined> {
		const result = this.cache.get(sid);
		if (result) {
			if (this.expired(result)) {
				await this.sessionService.remove(sid);
				return;
			}
			return result;
		}
		const session = await this.sessionService.get(sid);
		if (session) {
			const r = this.toExpress(session);
			this.cache.set(sid, r);
			return r;
		}
	}

	get: (sid: string, callback: (err: any, data?: Express.SessionData | undefined) => void) => void = (sid, callback) => {
		this._get(sid)
			.then(data => callback(null, data))
			.catch(callback);
	};

	set: (sid: string, data: Express.SessionData, callback?: (err?: any) => void) => void = (sid, data, callback) => {
		this.cache.set(sid, data as ExpressSession);
		this.sessionService.set(this.toJam(sid, data as ExpressSession))
			.then(callback)
			.catch(callback);
	};

	destroy: (sid: string, callback?: (err?: any) => void) => void = (sid, callback) => {
		this.sessionService.remove(sid)
			.then(callback)
			.catch(callback);
	};

	all: (callback: (err: any, obj?: { [sid: string]: Express.SessionData; } | null) => void) => void = callback => {
		this.sessionService.all()
			.then(data => {
				const result: { [id: string]: ExpressSession } = {};
				for (const item of data) {
					result[item.sessionID] = this.toExpress(item);
				}
				callback(null, result);
			})
			.catch(e => callback(e, undefined));
	};

	length: (callback: (err: any, length?: number | null) => void) => void = callback => {
		this.sessionService.count()
			.then(data => callback(null, data))
			.catch(e => callback(e, undefined));
	};

	clear: (callback?: (err?: any) => void) => void = callback => {
		this.cache.clear();
		this.sessionService.clear()
			.then(callback)
			.catch(callback);
	};

	// touch: (sid: string, session: Express.Session, callback?: (err?: any) => void) => void = (sid, session, callback) => {
	// 	this.set(sid, session, callback);
	// };

}

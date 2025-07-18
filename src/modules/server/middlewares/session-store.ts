import { Store } from 'express-session';
import { SessionNotifyEventObject, SessionService } from '../../../entity/session/session.service.js';
import { SessionData } from '../../../types/express.js';

export class ExpressSessionStore extends Store implements SessionNotifyEventObject {
	private readonly cache = new Map<string, SessionData>();

	constructor(private readonly sessionService: SessionService) {
		super();
		this.sessionService.registerNotify(this);
	}

	async clearCache(): Promise<void> {
		this.cache.clear();
	}

	private static expired(data: SessionData): boolean {
		return (data.cookie.expires || 0).valueOf() < Date.now();
	}

	private async _get(sid: string): Promise<SessionData | undefined> {
		const result = this.cache.get(sid);
		if (result) {
			if (ExpressSessionStore.expired(result)) {
				await this.sessionService.remove(sid);
				return;
			}
			return result;
		}
		const session = await this.sessionService.get(sid);
		if (session) {
			this.cache.set(sid, session);
			return session;
		}
		return;
	}

	get: (sid: string, callback: (err: Error | null | undefined, data?: SessionData | undefined) => void) => void = (sid, callback) => {
		this._get(sid)
			.then(data => callback(null, data))
			.catch(callback);
	};

	set: (sid: string, data: SessionData, callback?: (err?: Error | null | undefined | void) => void) => void = (sid, data, callback) => {
		this.cache.set(sid, data);
		this.sessionService.set(sid, data)
			.then(callback)
			.catch(callback);
	};

	destroy: (sid: string, callback?: (err?: any) => void) => void = (sid, callback) => {
		this.sessionService.remove(sid)
			.then(callback)
			.catch(callback);
	};

	all: (callback: (err: any, obj?: { [sid: string]: SessionData } | null) => void) => void = callback => {
		this.sessionService.all()
			.then(data => {
				const result: { [id: string]: SessionData } = {};
				for (const item of data) {
					result[item.sessionID] = item;
				}
				callback(null, result);
			})
			.catch(e => callback(e, undefined));
	};

	length: (callback: (err: any, length: number) => void) => void = callback => {
		this.sessionService.count()
			.then(data => callback(null, data))
			.catch(e => callback(e, 0));
	};

	clear: (callback?: (err?: any) => void) => void = callback => {
		this.cache.clear();
		this.sessionService.clear()
			.then(callback)
			.catch(callback);
	};
}

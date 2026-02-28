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
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		const expires = data.cookie.expires;
		if (!expires) return false; // no expiry = session-lifetime cookie
		return expires.valueOf() < Date.now();
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

	get: (sid: string, callback: (error?: unknown, data?: SessionData) => void) => void = (sid, callback) => {
		this._get(sid)
			.then(data => {
				callback(undefined, data);
			})
			.catch(callback);
	};

	set: (sid: string, data: SessionData, callback?: (error?: unknown) => void) => void = (sid, data, callback) => {
		this.cache.set(sid, data);
		void this.sessionService.set(sid, data)
			.then(callback)
			.catch(callback);
	};

	destroy: (sid: string, callback?: (error?: unknown) => void) => void = (sid, callback) => {
		void this.sessionService.remove(sid)
			.then(callback)
			.catch(callback);
	};

	all: (callback: (error?: unknown, obj?: Record<string, SessionData> | null) => void) => void = callback => {
		this.sessionService.all()
			.then(data => {
				const result = Object.fromEntries(
					data.map(item => [item.sessionID, item] as const)
				) as Record<string, SessionData>;
				callback(undefined, result);
			})
			.catch((error: unknown) => {
				callback(error);
			});
	};

	length: (callback: (error?: unknown, length?: number) => void) => void = callback => {
		this.sessionService.count()
			.then(data => {
				callback(undefined, data);
			})
			.catch((error: unknown) => {
				callback(error, 0);
			});
	};

	clear: (callback?: (error?: unknown) => void) => void = callback => {
		this.cache.clear();
		void this.sessionService.clear()
			.then(callback)
			.catch(callback);
	};
}

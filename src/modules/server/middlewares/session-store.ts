import { Store } from 'express-session';
import { SessionNotifyEventObject, SessionService } from '../../../entity/session/session.service.js';
import { SessionData } from '../../../types/express.js';

export class ExpressSessionStore extends Store implements SessionNotifyEventObject {
	private readonly cache = new Map<string, SessionData>();
	private readonly accessOrder: Array<string> = []; // Track access order for LRU eviction
	private readonly maxCacheSize = 1000;

	constructor(private readonly sessionService: SessionService) {
		super();
		this.sessionService.registerNotify(this);
	}

	async clearCache(): Promise<void> {
		this.cache.clear();
		this.accessOrder.length = 0;
	}

	private markAccessed(sid: string): void {
		const index = this.accessOrder.indexOf(sid);
		if (index !== -1) {
			this.accessOrder.splice(index, 1);
		}
		this.accessOrder.push(sid);
	}

	private evictLRU(): void {
		if (this.cache.size >= this.maxCacheSize && this.accessOrder.length > 0) {
			const lruSid = this.accessOrder.shift();
			if (lruSid) {
				this.cache.delete(lruSid);
			}
		}
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
			this.markAccessed(sid);
			return result;
		}
		const session = await this.sessionService.get(sid);
		if (session) {
			this.evictLRU();
			this.cache.set(sid, session);
			this.markAccessed(sid);
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
		this.evictLRU();
		this.cache.set(sid, data);
		this.markAccessed(sid);
		void this.sessionService.set(sid, data)
			.then(callback)
			.catch(callback);
	};

	destroy: (sid: string, callback?: (error?: unknown) => void) => void = (sid, callback) => {
		this.cache.delete(sid);
		const index = this.accessOrder.indexOf(sid);
		if (index !== -1) {
			this.accessOrder.splice(index, 1);
		}
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
		this.accessOrder.length = 0;
		void this.sessionService.clear()
			.then(callback)
			.catch(callback);
	};
}

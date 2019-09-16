import {BaseStoreService} from '../base/base.service';
import {Session} from './session.model';
import {SearchQuerySession, SessionStore} from './session.store';

export interface SessionNotifyEventObject {
	clearCache(): Promise<void>;
}

export class SessionService extends BaseStoreService<Session, SearchQuerySession> {
	private events: Array<SessionNotifyEventObject> = [];
	private jwthCache: Array<string> = [];

	constructor(public sessionStore: SessionStore) {
		super(sessionStore);
	}

	defaultSort(items: Array<Session>): Array<Session> {
		return items;
	}

	expired(data: Session): boolean {
		return data.expires < Date.now();
	}

	async exists(sessionID: string): Promise<boolean> {
		return !!(await this.sessionStore.searchOne({sessionID}));
	}

	async set(session: Session): Promise<void> {
		const old = await this.get(session.sessionID);
		if (old) {
			session.id = old.id;
			await this.sessionStore.replace(session);
		} else {
			await this.sessionStore.add(session);
		}
	}

	async get(sessionID: string): Promise<Session | undefined> {
		try {
			const session = await this.sessionStore.searchOne({sessionID});
			if (session && this.expired(session)) {
				await this.remove(sessionID);
				return;
			}
			return session;
		} catch (e) {
			return;
		}
	}

	async byJwth(jwth: string): Promise<Session | undefined> {
		return this.sessionStore.searchOne({jwth});
	}

	async byUserID(userID: string): Promise<Array<Session>> {
		return (await this.sessionStore.search({userID})).items;
	}

	async byID(id: string): Promise<Session | undefined> {
		return this.sessionStore.byId(id);
	}

	async remove(sessionID: string): Promise<void> {
		this.jwthCache = [];
		await this.sessionStore.removeByQuery({sessionID});
	}

	async removeByJwth(jwth: string): Promise<void> {
		this.jwthCache = [];
		await this.sessionStore.removeByQuery({jwth});
	}

	async all(): Promise<Array<Session>> {
		return this.sessionStore.all();
	}

	async clear(): Promise<void> {
		this.jwthCache = [];
		return this.sessionStore.clear();
	}

	async count(): Promise<number> {
		return this.sessionStore.count();
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
		const session = await this.sessionStore.searchOne({jwth});
		if (session) {
			this.jwthCache.push(jwth);
		}
		return !session;
	}


}

import {BaseStoreService} from '../base/base.service';
import {Session} from './session.model';
import {SearchQuerySession, SessionStore} from './session.store';

export class SessionService extends BaseStoreService<Session, SearchQuerySession> {

	constructor(public sessionStore: SessionStore) {
		super(sessionStore);
	}

	defaultSort(items: Array<Session>): Array<Session> {
		return items;
	}

	expired(data: Session): boolean {
		return data.expires < Date.now();
	}

	async exists(id: string): Promise<boolean> {
		try {
			const session = await this.sessionStore.byId(id);
			return !!session;
		} catch (e) {
			return false;
		}
	}

	async set(session: Session): Promise<void> {
		if (await this.exists(session.id)) {
			await this.sessionStore.replace(session);
		} else {
			await this.sessionStore.add(session);
		}
	}

	async get(id: string): Promise<Session | undefined> {
		try {
			const session = await this.sessionStore.byId(id);
			if (session && this.expired(session)) {
				await this.remove(id);
				return;
			}
			return session;
		} catch (e) {
			return;
		}
	}

	async byUserID(userID: string): Promise<Array<Session>> {
		return (await this.sessionStore.search({userID})).items;
	}

	async remove(id: string): Promise<void> {
		await this.sessionStore.remove(id);
	}

	async all(): Promise<Array<Session>> {
		return this.sessionStore.all();
	}

	async clear(): Promise<void> {
		return this.sessionStore.clear();
	}

	async count(): Promise<number> {
		return this.sessionStore.count();
	}

}

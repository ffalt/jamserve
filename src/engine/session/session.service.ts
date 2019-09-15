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

	async byUserID(userID: string): Promise<Array<Session>> {
		return (await this.sessionStore.search({userID})).items;
	}

	async remove(sessionID: string): Promise<void> {
		await this.sessionStore.removeByQuery({sessionID});
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

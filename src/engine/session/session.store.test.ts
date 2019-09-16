import {testStore} from '../base/base.store.spec';
import {mockSession, mockSession2} from './session.mock';
import {Session} from './session.model';
import {SearchQuerySession, SessionStore} from './session.store';

describe('SessionStore', () => {
	let sessionStore: SessionStore;
	testStore(testDB => {
			sessionStore = new SessionStore(testDB.database);
			return sessionStore;
		}, () => {
			return [mockSession(), mockSession2()];
		}, (mock: Session) => {
			const matches: Array<SearchQuerySession> = [
				{userID: mock.userID}, {sessionID: mock.sessionID}, {jwth: mock.jwth},
				{userID: mock.userID, sessionID: mock.sessionID, jwth: mock.jwth}
			];
			return matches;
		},
		() => {
			// TODO: SessionStore tests
		});
});

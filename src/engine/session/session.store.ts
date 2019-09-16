import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery} from '../base/base.store';
import {Session} from './session.model';

export interface SearchQuerySession extends SearchQuery {
	jwth?: string;
	sessionID?: string;
	userID?: string;
	client?: string;
}

export class SessionStore extends BaseStore<Session, SearchQuerySession> {

	constructor(db: Database) {
		super(DBObjectType.session, db);
	}

	protected transformQuery(query: SearchQuerySession): DatabaseQuery {
		const q = new QueryHelper();
		q.term('jwth', query.jwth);
		q.term('sessionID', query.sessionID);
		q.term('userID', query.userID);
		q.term('client', query.client);
		return q.get(query);
	}

}

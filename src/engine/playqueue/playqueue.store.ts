import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {PlayQueue} from './playqueue.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryPlayQueue extends SearchQuery {
	userID?: string;
}

export class PlayQueueStore extends BaseStore<PlayQueue, SearchQueryPlayQueue> {

	constructor(db: Database) {
		super(DBObjectType.playqueue, db);
	}

	protected transformQuery(query: SearchQueryPlayQueue): DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		return q.get(query);
	}

}

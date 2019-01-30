import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {State} from './state.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryState extends SearchQuery {
	destID?: string;
	destIDs?: Array<string>;
	userID?: string;
	type?: DBObjectType;
	isPlayed?: boolean;
	isFaved?: boolean;
	minRating?: number;
	maxRating?: number;
}

export class StateStore extends BaseStore<State, SearchQueryState> {

	constructor(db: Database) {
		super(DBObjectType.state, db);
	}

	protected transformQuery(query: SearchQueryState): DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		q.term('destID', query.destID);
		q.terms('destID', query.destIDs);
		q.term('destType', query.type);
		q.notNull('faved', query.isFaved);
		q.range('rated', query.maxRating, query.minRating);
		q.range('played', undefined, query.isPlayed ? 1 : undefined);
		return q.get(query);
	}

}

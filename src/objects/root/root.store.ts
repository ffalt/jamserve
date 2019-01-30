import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {Root} from './root.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryRoot extends SearchQuery {
	name?: string;
	path?: string;
}

export class RootStore extends BaseStore<Root, SearchQueryRoot> {

	constructor(db: Database) {
		super(DBObjectType.root, db);
	}

	protected transformQuery(query: SearchQueryRoot): DatabaseQuery {
		const q = new QueryHelper();
		q.term('name', query.name);
		q.term('path', query.path);
		q.match('name', query.query);
		return q.get(query);
	}

}

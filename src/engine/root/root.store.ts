import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {Root} from './root.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryRoot extends SearchQuery {
	id?: string;
	ids?: Array<string>;
	name?: string;
	path?: string;
}

export class RootStore extends BaseStore<Root, SearchQueryRoot> {

	constructor(db: Database) {
		super(DBObjectType.root, db);
	}

	protected transformQuery(query: SearchQueryRoot): DatabaseQuery {
		const q = new QueryHelper();
		q.term('id', query.id);
		q.terms('id', query.ids);
		q.term('name', query.name);
		q.term('path', query.path);
		q.match('name', query.query);
		return q.get(query);
	}

}

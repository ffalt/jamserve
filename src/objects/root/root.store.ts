import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Root} from './root.model';

export interface SearchQueryRoot extends SearchQuery {
	name?: string;
	path?: string;
	sorts?: Array<SearchQuerySort<JamParameters.RootSortField>>;
}

const sortFieldMap: { [key in JamParameters.RootSortField]: string } = {
	name: 'name',
	created: 'created'
};

export class RootStore extends BaseStore<Root, SearchQueryRoot> {

	constructor(db: Database) {
		super(DBObjectType.root, db);
	}

	protected transformQuery(query: SearchQueryRoot): DatabaseQuery {
		const q = new QueryHelper();
		q.term('name', query.name);
		q.term('path', query.path);
		q.match('name', query.query);
		return q.get(query, sortFieldMap);
	}

}

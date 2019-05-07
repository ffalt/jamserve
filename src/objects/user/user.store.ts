import {Database, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {JamParameters} from '../../model/jam-rest-params';
import {QueryHelper} from '../base/base.query.helper';
import {BaseStore, SearchQuery, SearchQuerySort} from '../base/base.store';
import {User} from './user.model';

export interface SearchQueryUser extends SearchQuery {
	name?: string;
	isAdmin?: boolean;
	sorts?: Array<SearchQuerySort<JamParameters.UserSortField>>;
}

const fieldMap: { [name in JamParameters.UserSortField]: string } = {
	name: 'name',
	created: 'created'
};

export class UserStore extends BaseStore<User, SearchQueryUser> {

	constructor(db: Database) {
		super(DBObjectType.user, db);
	}

	protected transformQuery(query: SearchQueryUser): DatabaseQuery {
		const q = new QueryHelper();
		q.term('name', query.name);
		q.bool('roles.admin', query.isAdmin);
		q.match('name', query.query);
		return q.get(query, fieldMap);
	}

}

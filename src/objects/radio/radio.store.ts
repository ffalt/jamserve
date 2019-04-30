import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery, SearchQuerySort} from '../base/base.store';
import {Radio} from './radio.model';
import {Database, DatabaseQuery} from '../../db/db.model';
import {JamParameters} from '../../model/jam-rest-params';

export interface SearchQueryRadio extends SearchQuery {
	name?: string;
	url?: string;
	homepage?: string;
	sorts?: Array<SearchQuerySort<JamParameters.RadioSortField>>;
}

const fieldMap: { [name in JamParameters.RadioSortField]: string } = {
	'name': 'name',
	'created': 'created'
};

export class RadioStore extends BaseStore<Radio, SearchQueryRadio> {

	constructor(db: Database) {
		super(DBObjectType.radio, db);
	}

	protected transformQuery(query: SearchQueryRadio): DatabaseQuery {
		const q = new QueryHelper();
		q.term('url', query.url);
		q.term('homepage', query.homepage);
		q.term('name', query.name);
		q.match('name', query.query);
		return q.get(query, fieldMap);
	}
}

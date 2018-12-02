import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {Radio} from './radio.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryRadio extends SearchQuery {
	name?: string;
	url?: string;
	homepage?: string;
}

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
		return q.get(query);
	}
}

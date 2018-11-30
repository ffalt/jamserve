import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {QueryHelper} from '../base/base.store';
import {Radio} from './radio.model';
import {Database, DatabaseQuery} from '../../db/db.model';

export interface SearchQueryRadio extends SearchQuery {
	id?: string;
	ids?: Array<string>;
	name?: string;
	url?: string;
}

export class RadioStore extends BaseStore<Radio, SearchQueryRadio> {

	constructor(db: Database) {
		super(DBObjectType.radio, db);
	}

	protected transformQuery(query: SearchQueryRadio): DatabaseQuery {
		const q = new QueryHelper();
		q.term('id', query.id);
		q.terms('id', query.ids);
		q.term('url', query.url);
		q.term('name', query.name);
		q.match('name', query.query);
		return q.get(query);
	}
}

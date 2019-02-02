import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {Database, DatabaseQuery} from '../../db/db.model';
import {Settings} from './settings.model';

export interface SearchQuerySettings extends SearchQuery {
	section?: string;
}

export class SettingsStore extends BaseStore<Settings, SearchQuerySettings> {

	constructor(db: Database) {
		super(DBObjectType.settings, db);
	}

	protected transformQuery(query: SearchQuerySettings): DatabaseQuery {
		const q = new QueryHelper();
		q.term('section', query.section);
		return q.get(query);
	}

}

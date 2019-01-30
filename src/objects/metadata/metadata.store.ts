import {DBObjectType} from '../../db/db.types';
import {BaseStore, QueryHelper, SearchQuery} from '../base/base.store';
import {Database, DatabaseQuery} from '../../db/db.model';
import {MetaData} from './metadata.model';
import {MetaDataType} from './metadata.types';

export interface SearchQueryMetaData extends SearchQuery {
	name?: string;
	dataType?: MetaDataType;
}

export class MetaDataStore extends BaseStore<MetaData, SearchQueryMetaData> {

	constructor(db: Database) {
		super(DBObjectType.metadata, db);
	}

	protected transformQuery(query: SearchQueryMetaData): DatabaseQuery {
		const q = new QueryHelper();
		q.term('name', query.name);
		q.term('dataType', query.dataType);
		return q.get(query);
	}

}

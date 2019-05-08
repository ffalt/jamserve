import {DBObject} from './base.model';
import {BaseStore, SearchQuery} from './base.store';

export class BaseStoreService<DBOBJECT extends DBObject, QUERY extends SearchQuery> {
	constructor(
		public store: BaseStore<DBOBJECT, QUERY>
	) {

	}
}

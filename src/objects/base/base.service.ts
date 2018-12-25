import {BaseStore, SearchQuery} from './base.store';
import {DBObject} from './base.model';

export class BaseStoreService<DBOBJECT extends DBObject, QUERY extends SearchQuery> {
	constructor(
		public store: BaseStore<DBOBJECT, QUERY>
	) {

	}
}

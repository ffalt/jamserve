import {DBObject} from './base.model';
import {BaseStore, SearchQuery} from './base.store';

export abstract class BaseStoreService<DBOBJECT extends DBObject, QUERY extends SearchQuery> {

	protected constructor(public store: BaseStore<DBOBJECT, QUERY>) {
	}

	abstract defaultSort(items: Array<DBOBJECT>): Array<DBOBJECT>;

}

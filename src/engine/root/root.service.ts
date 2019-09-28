import {BaseStoreService} from '../base/base.service';
import {Root} from './root.model';
import {RootStore, SearchQueryRoot} from './root.store';

export class RootService extends BaseStoreService<Root, SearchQueryRoot> {

	constructor(public rootStore: RootStore) {
		super(rootStore);
	}

	defaultSort(items: Array<Root>): Array<Root> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

}

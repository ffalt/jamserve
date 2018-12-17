import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../../objects/base/base.store';
import {User} from '../../objects/user/user.model';
import {DBObject} from '../../objects/base/base.model';
import {StateService} from '../../objects/state/state.service';

export class ListService {

	constructor(
		private stateService: StateService
	) {

	}

	async getFilteredIDs<T extends DBObject>(ids: Array<string>, query: SearchQuery, store: BaseStore<T, SearchQuery>): Promise<Array<string>> {
		const list = await store.searchIDs(Object.assign(query, {ids, amount: -1, offset: 0}));
		return list.sort((a, b) => {
			return ids.indexOf(a) - ids.indexOf(b);
		});
	}

	async getAvgHighest<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.stateService.getAvgHighestDestIDs(type);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getHighestRated<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.stateService.getHighestRatedDestIDs(type, user.id);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getFrequentlyPlayed<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.stateService.getFrequentlyPlayedDestIDs(type, user.id);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getFaved<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.stateService.getFavedDestIDs(type, user.id);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getRecentlyPlayed<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.stateService.getRecentlyPlayedDestIDs(type, user.id);
		return await this.getFilteredIDs(ids, query, store);
	}

}

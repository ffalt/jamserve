import {StateService} from '../state/state.service';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {BaseStoreService} from './base.service';
import {BaseStore, SearchQuery} from './base.store';
import {JamParameters} from '../../model/jam-rest-params';
import {ListResult} from './list-result';
import {randomItems} from '../../utils/random';
import {paginate} from '../../utils/paginate';
import {InvalidParamError} from '../../api/jam/error';

export abstract class BaseListService<T extends DBObject, Q extends SearchQuery> extends BaseStoreService<T, Q> {

	protected constructor(
		store: BaseStore<T, Q>,
		public stateService: StateService
	) {
		super(store);
	}

	async getList(query: { listQuery: JamParameters.List; query: Q; user: User }): Promise<ListResult<T>> {
		const list = await this.getListIDs(query.listQuery, query.query, query.user);
		return {...list, items: await this.store.byIds(list.items)};
	}

	async getListIDs(listQuery: JamParameters.List, query: Q, user: User): Promise<ListResult<string>> {
		let ids: Array<string> = [];
		let total: number | undefined;
		query.amount = -1;
		query.offset = 0;
		switch (listQuery.list) {
			case 'random':
				// TODO: cache ids to avoid duplicates in random items pagination
				ids = await this.store.searchIDs({...query, amount: -1, offset: 0});
				listQuery.amount = listQuery.amount || 20;
				total = ids.length;
				ids = randomItems<string>(ids, listQuery.amount || 20);
				break;
			case 'highest':
				ids = await this.getHighestRatedIDs(query, user);
				total = ids.length;
				ids = paginate(ids, listQuery.amount, listQuery.offset).items;
				break;
			case 'avghighest':
				ids = await this.getAvgHighestIDs(query);
				total = ids.length;
				ids = paginate(ids, listQuery.amount, listQuery.offset).items;
				break;
			case 'frequent':
				ids = await this.getFrequentlyPlayedIDs(query, user);
				total = ids.length;
				ids = paginate(ids, listQuery.amount, listQuery.offset).items;
				break;
			case 'faved':
				ids = await this.getFavedIDs(query, user);
				total = ids.length;
				ids = paginate(ids, listQuery.amount, listQuery.offset).items;
				break;
			case 'recent':
				ids = await this.getRecentlyPlayedIDs(query, user);
				total = ids.length;
				ids = paginate(ids, listQuery.amount, listQuery.offset).items;
				break;
			default:
				return Promise.reject(InvalidParamError('Unknown List Type'));
		}
		return {
			total,
			offset: listQuery.offset,
			amount: listQuery.amount,
			items: ids
		};
	}

	async getFilteredIDs(ids: Array<string>, query: Q): Promise<Array<string>> {
		const list = await this.store.searchIDs({...query, ids, amount: -1, offset: 0});
		return list.sort((a, b) => {
			return ids.indexOf(a) - ids.indexOf(b);
		});
	}

	async getAvgHighestIDs(query: Q): Promise<Array<string>> {
		const ids = await this.stateService.getAvgHighestDestIDs(this.store.type);
		return this.getFilteredIDs(ids, query);
	}

	async getHighestRatedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getHighestRatedDestIDs(this.store.type, user.id);
		return this.getFilteredIDs(ids, query);
	}

	async getFrequentlyPlayedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getFrequentlyPlayedDestIDs(this.store.type, user.id);
		return this.getFilteredIDs(ids, query);
	}

	async getFavedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getFavedDestIDs(this.store.type, user.id);
		return this.getFilteredIDs(ids, query);
	}

	async getRecentlyPlayedIDs(query: Q, user: User): Promise<Array<string>> {
		const ids = await this.stateService.getRecentlyPlayedDestIDs(this.store.type, user.id);
		return this.getFilteredIDs(ids, query);
	}

}

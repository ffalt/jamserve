import {DBObjectType} from '../../types';
import {BaseStore, SearchQuery} from '../base/base.store';
import {StateStore} from '../state/state.store';
import {User} from '../user/user.model';
import {DBObject} from '../base/base.model';

export class ListService {

	constructor(
		private stateStore: StateStore
	) {

	}

	async getListAvgHighest(type: DBObjectType): Promise<Array<string>> {
		const states = await this.stateStore.search({type});
		const ratings: { [id: string]: Array<number> } = {};
		states.forEach(state => {
			if (state.rated !== undefined) {
				ratings[state.destID] = ratings[state.destID] || [];
				ratings[state.destID].push(state.rated);
			}
		});
		const list = Object.keys(ratings).map(key => {
			return {
				id: key,
				avg: ratings[key].reduce((b, c) => (b + c), 0) / ratings[key].length
			};
		}).sort((a, b) => (b.avg - a.avg));
		return list.map(a => a.id);
	}

	async getFilteredIDs<T extends DBObject>(ids: Array<string>, query: SearchQuery, store: BaseStore<T, SearchQuery>): Promise<Array<string>> {
		const list = await store.searchIDs(Object.assign(query, {ids, amount: -1, offset: 0}));
		return list.sort((a, b) => {
			return ids.indexOf(a) - ids.indexOf(b);
		});
	}

	async getFilteredListAvgHighest<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListAvgHighest(type);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListHighestRated(type: DBObjectType, user: User): Promise<Array<string>> {
		const states = await this.stateStore.search({userID: user.id, type, minRating: 1});
		const ratings = states.filter(state => state.rated !== undefined).sort((a, b) => <number>b.rated - <number>a.rated);
		return ratings.map(a => a.destID);
	}

	async getFilteredListHighestRated<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListHighestRated(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListFrequentlyPlayed(type: DBObjectType, user: User): Promise<Array<string>> {
		const states = await this.stateStore.search({userID: user.id, type, isPlayed: true});
		states.sort((a, b) => b.played - a.played);
		return states.map(a => a.destID);
	}

	async getFilteredListFrequentlyPlayed<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListFrequentlyPlayed(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListFaved(type: DBObjectType, user: User): Promise<Array<string>> {
		const states = await this.stateStore.search({userID: user.id, type, isFaved: true});
		states.sort((a, b) => b.lastplayed - a.lastplayed);
		return states.map(a => a.destID);
	}

	async getFilteredListFaved<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListFaved(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListRecentlyPlayed(type: DBObjectType, user: User): Promise<Array<string>> {
		const states = await this.stateStore.search({userID: user.id, type, isPlayed: true});
		states.sort((a, b) => b.lastplayed - a.lastplayed);
		return states.map(a => a.destID);
	}

	async getFilteredListRecentlyPlayed<T extends SearchQuery>(type: DBObjectType, query: T, user: User, store: BaseStore<DBObject, SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListRecentlyPlayed(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

}

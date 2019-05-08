import {DBObjectType} from '../../db/db.types';
import {BaseStoreService} from '../base/base.service';
import {State, States} from './state.model';
import {SearchQueryState, StateStore} from './state.store';

export class StateService extends BaseStoreService<State, SearchQueryState> {

	constructor(public stateStore: StateStore) {
		super(stateStore);
	}

	private emptyState(destID: string, destType: DBObjectType, userID: string): State {
		return {
			id: '',
			type: DBObjectType.state,
			destID,
			destType,
			played: 0,
			lastplayed: 0,
			faved: undefined,
			rated: 0,
			userID
		};
	}

	async fav(id: string, type: DBObjectType, userID: string, remove: boolean): Promise<State> {
		const state = await this.findOrCreate(id, userID, type);
		if (remove) {
			if (state.faved === undefined) {
				return state;
			}
			state.faved = undefined;
		} else {
			if (state.faved !== undefined) {
				return state;
			}
			state.faved = Date.now();
		}
		if (state.id.length === 0) {
			await this.stateStore.add(state);
		} else {
			await this.stateStore.replace(state);
		}
		return state;
	}

	async rate(id: string, type: DBObjectType, userID: string, rating: number): Promise<State> {
		const state = await this.findOrCreate(id, userID, type);
		state.rated = (rating === 0) ? undefined : rating;
		if (state.id.length === 0) {
			await this.stateStore.add(state);
		} else {
			await this.stateStore.replace(state);
		}
		return state;
	}

	async findOrCreate(destID: string, userID: string, type: DBObjectType): Promise<State> {
		const state = await this.stateStore.searchOne({userID, destID, type});
		return state || this.emptyState(destID, type, userID);
	}

	async findOrCreateMany(destIDs: Array<string>, userID: string, type: DBObjectType): Promise<States> {
		if (!destIDs || destIDs.length === 0) {
			return {};
		}
		const list = await this.stateStore.search({userID, type, destIDs});
		const result: { [id: string]: State } = {};
		list.forEach((state) => {
			result[state.destID] = state;
		});
		destIDs.forEach((id) => {
			if (!result[id]) {
				result[id] = this.emptyState(id, type, userID);
			}
		});
		return result;
	}

	async getHighestRatedDestIDs(type: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateStore.search({userID, type, minRating: 1});
		const ratings = states.filter(state => state.rated !== undefined).sort((a, b) => Number(b.rated) - Number(a.rated));
		return ratings.map(a => a.destID);
	}

	async getAvgHighestDestIDs(type: DBObjectType): Promise<Array<string>> {
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

	async getFrequentlyPlayedDestIDs(type: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateStore.search({userID, type, isPlayed: true});
		states.sort((a, b) => b.played - a.played);
		return states.map(a => a.destID);
	}

	async getFavedDestIDs(type: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateStore.search({userID, type, isFaved: true});
		states.sort((a, b) => Number(b.faved) - Number(a.faved));
		return states.map(a => a.destID);
	}

	async getRecentlyPlayedDestIDs(type: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateStore.search({userID, type, isPlayed: true});
		states.sort((a, b) => b.lastplayed - a.lastplayed);
		return states.map(a => a.destID);
	}

	async reportPlaying(id: string, type: DBObjectType, userID: string): Promise<State> {
		const state = await this.findOrCreate(id, userID, type);
		state.played++;
		state.lastplayed = Date.now();
		await this.stateStore.upsert([state]);
		return state;
	}

}

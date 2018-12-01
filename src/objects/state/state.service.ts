import {DBObjectType} from '../../types';
import {StateStore} from './state.store';
import {State, States} from './state.model';

export class StateService {

	constructor(private stateStore: StateStore) {

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
		if (rating === 0) {
			state.rated = undefined;
		} else {
			state.rated = rating;
		}
		if (state.id.length === 0) {
			await this.stateStore.add(state);
		} else {
			await this.stateStore.replace(state);
		}
		return state;
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

	async findOrCreate(destID: string, userID: string, type: DBObjectType): Promise<State> {
		const state = await this.stateStore.searchOne({userID, destID, type});
		return state || this.emptyState(destID, type, userID);
	}

	async findOrCreateMulti(destIDs: Array<string>, userID: string, type: DBObjectType): Promise<States> {
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
}

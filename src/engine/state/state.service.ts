import {DBObjectType} from '../../types';
import {StateStore} from './state.store';
import {State} from './state.model';

export class StateService {

	constructor(private stateStore: StateStore) {

	}

	async fav(id: string, type: DBObjectType, userID: string, remove: boolean): Promise<State> {
		const state = await this.stateStore.findOrCreate(id, userID, type);
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
		const state = await this.stateStore.findOrCreate(id, userID, type);
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
}

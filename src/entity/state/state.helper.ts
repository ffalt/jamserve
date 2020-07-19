import {State} from './state';
import {DBObjectType} from '../../types/enums';
import {User} from '../user/user';
import {EntityManager} from 'mikro-orm/dist/EntityManager';
import {EntityRepository} from 'mikro-orm';

// This is not a service, to avoid circular usage orm => orm.baseRepository => stateServide => orm
export class StateHelper {
	private stateRepo: EntityRepository<State>;

	constructor(private em: EntityManager) {
		this.stateRepo = this.em.getRepository(State);
	}

	private emptyState(destID: string, destType: DBObjectType, user: User): State {
		return this.stateRepo.create({
			destID,
			destType,
			played: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			lastPlayed: undefined,
			faved: undefined,
			rated: 0,
			user
		});
	}

	async fav(destID: string, destType: DBObjectType, user: User, remove: boolean): Promise<State> {
		const state = await this.findOrCreate(destID, destType, user);
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
		await this.stateRepo.persistAndFlush(state);
		return state;
	}

	async rate(destID: string, destType: DBObjectType, user: User, rating: number): Promise<State> {
		const state = await this.findOrCreate(destID, destType, user);
		state.rated = (rating === 0) ? undefined : rating;
		await this.stateRepo.persistAndFlush(state);
		return state;
	}

	async findOrCreate(destID: string, destType: DBObjectType, user: User): Promise<State> {
		const state = await this.stateRepo.findOne({user: user.id, destID: {$eq: destID}, destType: {$eq: destType}});
		return state || this.emptyState(destID, destType, user);
	}

	//
	// async findOrCreateMany(destIDs: Array<string>, userID: string, type: DBObjectType): Promise<States> {
	// 	if (!destIDs || destIDs.length === 0) {
	// 		return {};
	// 	}
	// 	const list = await this.stateStore.search({userID, type, destIDs});
	// 	const result: { [id: string]: State } = {};
	// 	list.items.forEach(state => {
	// 		result[state.destID] = state;
	// 	});
	// 	destIDs.forEach(id => {
	// 		if (!result[id]) {
	// 			result[id] = this.emptyState(id, type, userID);
	// 		}
	// 	});
	// 	return result;
	// }

	async getHighestRatedDestIDs(destType: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateRepo.find({user: {id: userID}, destType: {$eq: destType}, rated: {$gte: 1}});
		const ratings = states.sort((a, b) => Number(b.rated) - Number(a.rated));
		return ratings.map(a => a.destID);
	}

	async getAvgHighestDestIDs(destType: DBObjectType): Promise<Array<string>> {
		const states = await this.stateRepo.find({destType: {$eq: destType}});
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

	async getFrequentlyPlayedDestIDs(destType: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateRepo.find({user: {id: userID}, destType: {$eq: destType}, played: {$gte: 1}});
		return states.sort((a, b) => Number(b.played) - Number(a.played)).map(a => a.destID);
	}

	async getFavedDestIDs(destType: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateRepo.find({user: {id: userID}, destType: {$eq: destType}, faved: {$gte: 1}});
		return states.sort((a, b) => Number(b.faved) - Number(a.faved)).map(a => a.destID);
	}

	async getRecentlyPlayedDestIDs(destType: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateRepo.find({user: {id: userID}, destType: {$eq: destType}, played: {$gte: 1}});
		return states.sort((a, b) => Number(b.lastPlayed) - Number(a.lastPlayed)).map(a => a.destID);
	}

	async reportPlaying(destID: string, destType: DBObjectType, user: User): Promise<State> {
		const state = await this.findOrCreate(destID, destType, user);
		state.played = (state.played || 0) + 1;
		state.lastPlayed = Date.now();
		await this.stateRepo.persistAndFlush(state);
		return state;
	}

}

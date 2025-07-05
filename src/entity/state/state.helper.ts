import { State } from './state.js';
import { DBObjectType } from '../../types/enums.js';
import { User } from '../user/user.js';
import seq from 'sequelize';
import { EntityManager, EntityRepository } from '../../modules/orm/index.js';

// This is not a service, to avoid circular usage orm => orm.baseRepository => stateServide => orm
export class StateHelper {
	private readonly stateRepo: EntityRepository<State>;

	constructor(private readonly em: EntityManager) {
		this.stateRepo = this.em.getRepository(State);
	}

	private async emptyState(destID: string, destType: DBObjectType, user: User): Promise<State> {
		const state = this.stateRepo.create({
			destID,
			destType,
			played: 0,
			createdAt: new Date(),
			updatedAt: new Date(),
			lastPlayed: undefined,
			faved: undefined,
			rated: 0
		});
		await state.user.set(user);
		return state;
	}

	async fav(destID: string, destType: DBObjectType, user: User, remove: boolean): Promise<State> {
		const state = await this.findOrCreate(destID, destType, user);
		if (remove) {
			if (state.faved === undefined) {
				return state;
			}
			(state as any).faved = null;
		} else {
			if (state.faved !== undefined) {
				return state;
			}
			state.faved = new Date();
		}
		await this.stateRepo.persistAndFlush(state);
		if ((state as any).faved === null) {
			state.faved = undefined;
		}
		return state;
	}

	async rate(destID: string, destType: DBObjectType, user: User, rating: number): Promise<State> {
		const state = await this.findOrCreate(destID, destType, user);
		state.rated = (rating === 0) ? undefined : rating;
		await this.stateRepo.persistAndFlush(state);
		return state;
	}

	async findOrCreate(destID: string, destType: DBObjectType, user: User): Promise<State> {
		const state = await this.stateRepo.findOne({ where: { user: user.id, destID, destType } });
		return state || (await this.emptyState(destID, destType, user));
	}

	async getHighestRatedDestIDs(destType: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateRepo.find({
			where: { user: userID, destType, rated: { [seq.Op.gte]: 1 } },
			order: [['rated', 'DESC']]
		});
		return states.map(a => a.destID);
	}

	async getAvgHighestDestIDs(destType: DBObjectType): Promise<Array<string>> {
		// TODO: calc avg in db
		const states = await this.stateRepo.find({ where: { destType, rated: { [seq.Op.gte]: 1 } } });
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
		const states = await this.stateRepo.find({
			where: { user: userID, destType, played: { [seq.Op.gte]: 1 } },
			order: [
				['played', 'DESC'],
				['lastPlayed', 'DESC']
			]
		});
		return states.map(a => a.destID);
	}

	async getFavedDestIDs(destType: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateRepo.find({
			where: { user: userID, destType, faved: { [seq.Op.ne]: null as unknown as undefined } },
			order: [['faved', 'DESC']]
		});
		return states.map(a => a.destID);
	}

	async getRecentlyPlayedDestIDs(destType: DBObjectType, userID: string): Promise<Array<string>> {
		const states = await this.stateRepo.find({
			where: { user: userID, destType, played: { [seq.Op.gte]: 1 } },
			order: [['lastPlayed', 'DESC']]
		});
		return states.map(a => a.destID);
	}

	async reportPlaying(destID: string, destType: DBObjectType, user: User): Promise<State> {
		const state = await this.findOrCreate(destID, destType, user);
		state.played = (state.played || 0) + 1;
		state.lastPlayed = new Date();
		await this.stateRepo.persistAndFlush(state);
		return state;
	}
}

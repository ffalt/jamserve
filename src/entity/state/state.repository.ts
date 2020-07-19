import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {State} from './state';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@Repository(State)
export class StateRepository extends BaseRepository<State, any, any> {
	objType = DBObjectType.state;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: any): void {
	}

	async buildFilter(filter?: any, user?: User): Promise<QBFilterQuery<State>> {
		return {};
	}

	async findOrCreate(destID: string, type: DBObjectType, userID: string): Promise<State> {
		const state = await this.findOne({
			$and: [
				{user: {id: userID}},
				{destID: {$eq: destID}},
				{destType: {$eq: type}}
			]
		});
		return state || new State();
	}

	async findMany(destIDs: Array<string>, type: DBObjectType, userID: string): Promise<Array<State>> {
		return await this.find({
			$and: [
				{user: {id: userID}},
				{destID: {$in: destIDs}},
				{destType: {$eq: type}}
			]
		});
	}

}

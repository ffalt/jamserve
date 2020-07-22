import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {State} from './state';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

// @Repository(State)
export class StateRepository extends BaseRepository<State, any, any> {
	objType = DBObjectType.state;

	buildOrder(order?: any): Array<OrderItem> {
		//currently none
		return [];
	}

	async buildFilter(filter?: any, user?: User): Promise<FindOptions<State>> {
		//currently none
		return {};
	}

	async findOrCreate(destID: string, destType: DBObjectType, userID: string): Promise<State> {
		const state = await this.findOne({where: {user: userID, destID, destType}});
		return state || new State();
	}

	async findMany(destIDs: Array<string>, destType: DBObjectType, userID: string): Promise<Array<State>> {
		return await this.find({where: {user: userID, destID: destIDs, destType}});
	}

}

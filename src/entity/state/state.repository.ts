import {BaseRepository} from '../base/base.repository.js';
import {DBObjectType} from '../../types/enums.js';
import {State} from './state.js';
import {User} from '../user/user.js';
import {FindOptions, OrderItem} from '../../modules/orm/index.js';
import {DefaultOrderArgs} from '../base/base.args.js';

export class StateRepository extends BaseRepository<State, void, DefaultOrderArgs> {
	objType = DBObjectType.state;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: void, __?: User): Promise<FindOptions<State>> {
		return {};
	}

	async findOrCreate(destID: string, destType: DBObjectType, userID: string): Promise<State> {
		const state = await this.findOne({where: {user: userID, destID, destType}});
		return state || this.create({});
	}

	async findMany(destIDs: Array<string>, destType: DBObjectType, userID: string): Promise<Array<State>> {
		return await this.find({where: {user: userID, destID: destIDs, destType}});
	}

}

import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { State } from './state.js';
import { User } from '../user/user.js';
import { DefaultOrderParameters } from '../base/base.parameters.js';
import { FindOptions, OrderItem } from 'sequelize';

export class StateRepository extends BaseRepository<State, void, DefaultOrderParameters> {
	objType = DBObjectType.state;

	buildOrder(_?: DefaultOrderParameters): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: unknown, __?: User): Promise<FindOptions<State>> {
		return {};
	}

	async findOrCreate(destinationID: string, destinationType: DBObjectType, userID: string): Promise<State> {
		const state = await this.findOne({ where: { user: userID, destID: destinationID, destType: destinationType } });
		return state ?? this.create({});
	}

	async findMany(destinationIDs: Array<string>, destinationType: DBObjectType, userID: string): Promise<Array<State>> {
		return await this.find({ where: { user: userID, destID: destinationIDs, destType: destinationType } });
	}
}

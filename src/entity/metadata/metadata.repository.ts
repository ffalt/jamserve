import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { MetaData } from './metadata.js';
import { User } from '../user/user.js';
import { DefaultOrderParameters } from '../base/base.parameters.js';
import { FindOptions, OrderItem } from 'sequelize';

export class MetaDataRepository extends BaseRepository<MetaData, void, DefaultOrderParameters> {
	objType = DBObjectType.metadata;

	buildOrder(_?: DefaultOrderParameters): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: unknown, __?: User): Promise<FindOptions<MetaData>> {
		return {};
	}
}

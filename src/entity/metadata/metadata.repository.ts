import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Metadata } from './metadata.js';
import { User } from '../user/user.js';
import { DefaultOrderParameters } from '../base/base.parameters.js';
import { FindOptions, OrderItem } from 'sequelize';

export class MetadataRepository extends BaseRepository<Metadata, void, DefaultOrderParameters> {
	objType = DBObjectType.metadata;

	buildOrder(_?: DefaultOrderParameters): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: unknown, __?: User): Promise<FindOptions<Metadata>> {
		return {};
	}
}

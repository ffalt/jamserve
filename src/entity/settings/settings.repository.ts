import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Settings } from './settings.js';
import { User } from '../user/user.js';
import { DefaultOrderParameters } from '../base/base.parameters.js';
import { FindOptions, OrderItem } from 'sequelize';

export class SettingsRepository extends BaseRepository<Settings, void, DefaultOrderParameters> {
	objType = DBObjectType.settings;

	buildOrder(_?: DefaultOrderParameters): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: unknown, __?: User): Promise<FindOptions<Settings>> {
		return {};
	}
}

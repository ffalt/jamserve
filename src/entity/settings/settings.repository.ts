import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Settings} from './settings';
import {User} from '../user/user';
import {FindOptions, OrderItem} from '../../modules/orm';

export class SettingsRepository extends BaseRepository<Settings, any, any> {
	objType = DBObjectType.settings;

	buildOrder(_?: any): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: any, __?: User): Promise<FindOptions<Settings>> {
		return {};
	}
}

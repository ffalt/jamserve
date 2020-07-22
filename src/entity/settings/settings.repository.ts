import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Settings} from './settings';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

// @Repository(Settings)
export class SettingsRepository extends BaseRepository<Settings, any, any> {
	objType = DBObjectType.settings;

	buildOrder(order?: any): Array<OrderItem> {
		//currently none
		return [];
	}

	async buildFilter(filter?: any, user?: User): Promise<FindOptions<Settings>> {
		//currently none
		return {};
	}
}

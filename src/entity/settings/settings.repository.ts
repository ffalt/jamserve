import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Settings} from './settings';
import {User} from '../user/user';
import {FindOptions, OrderItem} from '../../modules/orm';
import {DefaultOrderArgs} from '../base/base.args';

export class SettingsRepository extends BaseRepository<Settings, void, DefaultOrderArgs> {
	objType = DBObjectType.settings;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: void, __?: User): Promise<FindOptions<Settings>> {
		return {};
	}
}

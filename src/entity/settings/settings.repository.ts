import {BaseRepository} from '../base/base.repository.js';
import {DBObjectType} from '../../types/enums.js';
import {Settings} from './settings.js';
import {User} from '../user/user.js';
import {FindOptions, OrderItem} from '../../modules/orm/index.js';
import {DefaultOrderArgs} from '../base/base.args.js';

export class SettingsRepository extends BaseRepository<Settings, void, DefaultOrderArgs> {
	objType = DBObjectType.settings;

	buildOrder(_?: DefaultOrderArgs): Array<OrderItem> {
		return [];
	}

	async buildFilter(_?: void, __?: User): Promise<FindOptions<Settings>> {
		return {};
	}
}

import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Settings} from './settings';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@Repository(Settings)
export class SettingsRepository extends BaseRepository<Settings, any, any> {
	objType = DBObjectType.settings;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: any): void {
	}

	async buildFilter(filter?: any, user?: User): Promise<QBFilterQuery<Settings>> {
		return {};
	}
}

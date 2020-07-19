import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {MetaData} from './metadata';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@Repository(MetaData)
export class MetaDataRepository extends BaseRepository<MetaData, any, any> {
	objType = DBObjectType.metadata;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: any): void {
	}

	async buildFilter(filter?: any, user?: User): Promise<QBFilterQuery<MetaData>> {
		return {};
	}

}

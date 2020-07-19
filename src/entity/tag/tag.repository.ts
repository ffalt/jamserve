import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {Tag} from './tag';
import {DBObjectType} from '../../types/enums';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';

@Repository(Tag)
export class TagRepository extends BaseRepository<Tag, any, any> {
	objType = DBObjectType.tag;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: any): void {
	}

	async buildFilter(filter?: any, user?: User): Promise<QBFilterQuery<Tag>> {
		return {};
	}

}

import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType, UserRole} from '../../types/enums';
import {User} from './user';
import {DefaultOrderArgs} from '../base/base.args';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {UserFilterArgs, UserOrderArgs} from './user.args';
import {QHelper} from '../base/base';

@Repository(User)
export class UserRepository extends BaseRepository<User, UserFilterArgs, UserOrderArgs> {
	objType = DBObjectType.user;
	indexProperty = 'name';

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: UserOrderArgs): void {
		this.applyDefaultOrderByEntry(result, direction, order?.orderBy);
	}

	async buildFilter(filter?: UserFilterArgs, user?: User): Promise<QBFilterQuery<User>> {
		return filter ? QHelper.buildQuery<User>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{email: QHelper.eq(filter.email)},
				{createdAt: QHelper.gte(filter.since)},
				{roleAdmin: QHelper.eq(filter.roles?.includes(UserRole.admin) ? true : undefined)},
				{rolePodcast: QHelper.eq(filter.roles?.includes(UserRole.podcast) ? true : undefined)},
				{roleStream: QHelper.eq(filter.roles?.includes(UserRole.stream) ? true : undefined)},
				{roleUpload: QHelper.eq(filter.roles?.includes(UserRole.upload) ? true : undefined)},
				{user: user?.roleAdmin ? undefined : user?.id}
			]
		) : {};
	}

}

import {FindOptions, OrderItem, QHelper} from '../../modules/orm/index.js';
import {BaseRepository} from '../base/base.repository.js';
import {DBObjectType, UserRole} from '../../types/enums.js';
import {User} from './user.js';
import {UserFilterArgs, UserOrderArgs} from './user.args.js';

export class UserRepository extends BaseRepository<User, UserFilterArgs, UserOrderArgs> {
	objType = DBObjectType.user;
	indexProperty = 'name';

	buildOrder(order?: UserOrderArgs): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: UserFilterArgs, user?: User): Promise<FindOptions<User>> {
		return filter ? QHelper.buildQuery<User>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query, this.em.dialect)},
				{name: QHelper.eq(filter.name)},
				{email: QHelper.eq(filter.email)},
				{createdAt: QHelper.gte(filter.since)},
				{roleAdmin: QHelper.eq(filter.roles?.includes(UserRole.admin) ? true : undefined)},
				{rolePodcast: QHelper.eq(filter.roles?.includes(UserRole.podcast) ? true : undefined)},
				{roleStream: QHelper.eq(filter.roles?.includes(UserRole.stream) ? true : undefined)},
				{roleUpload: QHelper.eq(filter.roles?.includes(UserRole.upload) ? true : undefined)},
				{id: user?.roleAdmin ? undefined : user?.id}
			]
		) : {};
	}

}

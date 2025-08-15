import { QHelper } from '../../modules/orm/index.js';
import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, UserRole } from '../../types/enums.js';
import { User } from './user.js';
import { UserFilterParameters, UserOrderParameters } from './user.parameters.js';
import { FindOptions, OrderItem } from 'sequelize';

export class UserRepository extends BaseRepository<User, UserFilterParameters, UserOrderParameters> {
	objType = DBObjectType.user;
	indexProperty = 'name';

	buildOrder(order?: UserOrderParameters): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: UserFilterParameters, user?: User): Promise<FindOptions<User>> {
		return filter ?
			QHelper.buildQuery<User>(
				[
					{ id: filter.ids },
					{ name: QHelper.like(filter.query, this.em.dialect) },
					{ name: QHelper.eq(filter.name) },
					{ email: QHelper.eq(filter.email) },
					{ createdAt: QHelper.gte(filter.since) },
					{ roleAdmin: QHelper.eq(filter.roles?.includes(UserRole.admin) ? true : undefined) },
					{ rolePodcast: QHelper.eq(filter.roles?.includes(UserRole.podcast) ? true : undefined) },
					{ roleStream: QHelper.eq(filter.roles?.includes(UserRole.stream) ? true : undefined) },
					{ roleUpload: QHelper.eq(filter.roles?.includes(UserRole.upload) ? true : undefined) },
					{ id: user?.roleAdmin ? undefined : user?.id }
				]
			) :
			{};
	}
}

import { FindOptions, OrderItem, QHelper } from '../../modules/orm/index.js';
import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, SessionOrderFields } from '../../types/enums.js';
import { Session } from './session.js';
import { User } from '../user/user.js';
import { SessionFilterArgs, SessionOrderArgs } from './session.args.js';
import { OrderHelper } from '../base/base.js';

export class SessionRepository extends BaseRepository<Session, SessionFilterArgs, SessionOrderArgs> {
	objType = DBObjectType.session;

	buildOrder(order?: SessionOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case SessionOrderFields.expires:
			case SessionOrderFields.default:
				return [['expires', direction]];
		}
		return [];
	}

	async buildFilter(filter?: SessionFilterArgs, user?: User): Promise<FindOptions<Session>> {
		return filter ?
			QHelper.buildQuery<Session>(
				[
					{ id: filter.ids },
					{ createdAt: QHelper.gte(filter.since) },
					{ client: QHelper.eq(filter.client) },
					{ agent: QHelper.eq(filter.agent) },
					{ mode: QHelper.eq(filter.mode) },
					{ expires: QHelper.lte(filter.expiresTo) },
					{ expires: QHelper.gte(filter.expiresFrom) },
					{ user: QHelper.inOrEqual(filter.userIDs) },
					{ user: user?.id }
				]
			) :
				{};
	}

	async byUserID(userID: string): Promise<Array<Session>> {
		return await this.find({ where: { user: userID } });
	}
}

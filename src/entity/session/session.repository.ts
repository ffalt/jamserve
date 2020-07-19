import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Session} from './session';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {SessionFilterArgs, SessionOrderArgs} from './session.args';

@Repository(Session)
export class SessionRepository extends BaseRepository<Session, SessionFilterArgs, SessionOrderArgs> {
	objType = DBObjectType.session;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: SessionOrderArgs): void {
		this.applyDefaultOrderByEntry(result, direction, order?.orderBy);
	}

	async buildFilter(filter?: SessionFilterArgs, user?: User): Promise<QBFilterQuery<Session>> {
		return filter ? QHelper.buildQuery<Session>(
			[
				{id: filter.ids},
				{createdAt: QHelper.gte(filter.since)},
				{client: QHelper.eq(filter.client)},
				{agent: QHelper.eq(filter.agent)},
				{mode: QHelper.eq(filter.mode)},
				{expires: QHelper.lte(filter.expiresTo)},
				{expires: QHelper.gte(filter.expiresFrom)},
				{user: user?.id}
			]
		) : {};
	}
}

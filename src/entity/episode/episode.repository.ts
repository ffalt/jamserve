import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, EpisodeOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { Episode } from './episode.js';
import { EpisodeFilterArgs, EpisodeOrderArgs } from './episode.args.js';
import { User } from '../user/user.js';
import { FindOptions, OrderItem, QHelper } from '../../modules/orm/index.js';

export class EpisodeRepository extends BaseRepository<Episode, EpisodeFilterArgs, EpisodeOrderArgs> {
	objType = DBObjectType.episode;

	buildOrder(order?: EpisodeOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case EpisodeOrderFields.created:
				return [['createdAt', direction]];
			case EpisodeOrderFields.updated:
				return [['updatedAt', direction]];
			case EpisodeOrderFields.status:
				return [['status', direction]];
			case EpisodeOrderFields.name:
				return [['name', direction]];
			case EpisodeOrderFields.default:
			case EpisodeOrderFields.date:
				return [['date', direction]];
		}
		return [];
	}

	async buildFilter(filter?: EpisodeFilterArgs, _?: User): Promise<FindOptions<Episode>> {
		return filter ?
			QHelper.buildQuery<Episode>(
				[
					{ id: filter.ids },
					{ name: QHelper.like(filter.query, this.em.dialect) },
					{ name: QHelper.eq(filter.name) },
					{ status: QHelper.inOrEqual(filter.statuses) },
					{ guid: QHelper.inOrEqual(filter.guids) },
					{ author: QHelper.inOrEqual(filter.authors) },
					{ createdAt: QHelper.gte(filter.since) },
					{ podcast: QHelper.inOrEqual(filter.podcastIDs) }
				]
			) :
			{};
	}
}

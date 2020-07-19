import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType, EpisodeOrderFields} from '../../types/enums';
import {QHelper} from '../base/base';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {Episode} from './episode';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {EpisodeFilterArgs, EpisodeOrderArgs} from './episode.args';
import {User} from '../user/user';

@Repository(Episode)
export class EpisodeRepository extends BaseRepository<Episode, EpisodeFilterArgs, EpisodeOrderArgs> {
	objType = DBObjectType.episode;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: EpisodeOrderArgs): void {
		switch (order?.orderBy) {
			case EpisodeOrderFields.created:
				result.createdAt = direction;
				break;
			case EpisodeOrderFields.updated:
				result.updatedAt = direction;
				break;
			case EpisodeOrderFields.status:
				result.status = direction;
				break;
			case EpisodeOrderFields.name:
				result.name = direction;
				break;
			case EpisodeOrderFields.default:
			case EpisodeOrderFields.date:
				result.date = direction;
				break;
		}
	}

	async buildFilter(filter?: EpisodeFilterArgs, user?: User): Promise<QBFilterQuery<Episode>> {
		return filter ? QHelper.buildQuery<Episode>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{status: QHelper.inOrEqual(filter.statuses)},
				{guid: QHelper.inOrEqual(filter.guids)},
				{author: QHelper.inOrEqual(filter.authors)},
				{createdAt: QHelper.gte(filter.since)},
				{podcast: QHelper.foreignKey(filter.podcastIDs)}
			]
		) : {};
	}

}

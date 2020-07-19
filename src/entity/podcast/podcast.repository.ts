import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType, PodcastOrderFields} from '../../types/enums';
import {Podcast} from './podcast';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {PodcastFilterArgs, PodcastOrderArgs} from './podcast.args';

@Repository(Podcast)
export class PodcastRepository extends BaseRepository<Podcast, PodcastFilterArgs, PodcastOrderArgs> {
	objType = DBObjectType.podcast;
	indexProperty = 'name';

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: PodcastOrderArgs): void {
		switch (order?.orderBy) {
			case PodcastOrderFields.created:
				result.createdAt = direction;
				break;
			case PodcastOrderFields.updated:
				result.updatedAt = direction;
				break;
			case PodcastOrderFields.lastCheck:
				result.lastCheck = direction;
				break;
			case PodcastOrderFields.default:
			case PodcastOrderFields.name:
				result.name = direction;
				break;
		}
	}

	async buildFilter(filter?: PodcastFilterArgs, user?: User): Promise<QBFilterQuery<Podcast>> {
		return filter ? QHelper.buildQuery<Podcast>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{description: QHelper.eq(filter.description)},
				{url: QHelper.eq(filter.url)},
				{author: QHelper.eq(filter.author)},
				{title: QHelper.eq(filter.title)},
				{generator: QHelper.eq(filter.generator)},
				{status: QHelper.inOrEqual(filter.statuses)},
				{createdAt: QHelper.gte(filter.since)},
				{episodes: QHelper.foreignKeys(filter.episodeIDs)},
				{lastCheck: QHelper.lte(filter.lastCheckTo)},
				{lastCheck: QHelper.gte(filter.lastCheckFrom)},
				...QHelper.inStringArray('categories', filter.categories)
			]
		) : {};
	}

}

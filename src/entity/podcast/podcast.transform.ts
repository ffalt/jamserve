import {Inject, InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform';
import {Orm} from '../../modules/engine/services/orm.service';
import {Podcast as ORMPodcast} from './podcast';
import {IncludesPodcastArgs} from './podcast.args';
import {User} from '../user/user';
import {PodcastBase, PodcastIndex, PodcastUpdateStatus} from './podcast.model';
import {DBObjectType, PodcastStatus} from '../../types/enums';
import {IndexResult, IndexResultGroup} from '../base/base';
import {PodcastService} from './podcast.service';

@InRequestScope
export class PodcastTransformService extends BaseTransformService {
	@Inject
	public podcastService!: PodcastService;

	async podcastBase(orm: Orm, o: ORMPodcast, podcastArgs: IncludesPodcastArgs, user: User): Promise<PodcastBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			url: o.url,
			status: this.podcastService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
			lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined,
			error: o.errorMessage,
			description: o.description,
			episodeIDs: podcastArgs.podcastIncEpisodeIDs ? await o.episodes.getIDs() : undefined,
			episodeCount: podcastArgs.podcastIncEpisodeCount ? await o.episodes.count() : undefined,
			state: podcastArgs.podcastIncState ? await this.state(orm, o.id, DBObjectType.podcast, user.id) : undefined
		};
	}

	async podcastIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMPodcast>>): Promise<PodcastIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				episodeCount: await item.episodes.count()
			};
		});
	}

	podcastStatus(o: ORMPodcast): PodcastUpdateStatus {
		return this.podcastService.isDownloading(o.id) ? {status: PodcastStatus.downloading} : {status: o.status, error: o.errorMessage, lastCheck: o.lastCheck ? o.lastCheck.valueOf() : undefined};
	}

}

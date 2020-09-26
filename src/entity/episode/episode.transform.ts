import {Inject, InRequestScope} from 'typescript-ioc';
import {BaseTransformService} from '../base/base.transform';
import {Orm} from '../../modules/engine/services/orm.service';
import {Episode as ORMEpisode, EpisodeChapter, EpisodeEnclosure} from './episode';
import {IncludesEpisodeArgs} from './episode.args';
import {User} from '../user/user';
import {EpisodeBase, EpisodeUpdateStatus} from './episode.model';
import {DBObjectType, JamObjectType, PodcastStatus} from '../../types/enums';
import {EpisodeService} from './episode.service';
import {AudioModule} from '../../modules/audio/audio.module';

@InRequestScope
export class EpisodeTransformService extends BaseTransformService {
	@Inject
	public episodeService!: EpisodeService;
	@Inject
	public audioModule!: AudioModule;

	async episodeBase(orm: Orm, o: ORMEpisode, episodeArgs: IncludesEpisodeArgs, user: User): Promise<EpisodeBase> {
		const chapters: Array<EpisodeChapter> | undefined = o.chaptersJSON ? JSON.parse(o.chaptersJSON) : undefined;
		const enclosures: Array<EpisodeEnclosure> | undefined = o.enclosuresJSON ? JSON.parse(o.enclosuresJSON) : undefined;
		const podcast = await o.podcast.getOrFail();
		const tag = await o.tag.get();
		return {
			id: o.id,
			name: o.name,
			objType: JamObjectType.episode,
			date: o.date.valueOf(),
			summary: o.summary,
			author: o.author,
			error: o.error,
			chapters,
			url: enclosures ? enclosures[0].url : undefined,
			link: o.link,
			guid: o.guid,
			podcastID: podcast.id,
			podcastName: podcast.name,
			status: this.episodeService.isDownloading(o.id) ? PodcastStatus.downloading : o.status,
			created: o.createdAt.valueOf(),
			duration: tag?.mediaDuration ?? o.duration ?? 0,
			tag: episodeArgs.episodeIncTag ? await this.mediaTag(orm, tag) : undefined,
			media: episodeArgs.episodeIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
			tagRaw: episodeArgs.episodeIncRawTag && o.path ? await this.audioModule.readRawTag(o.path) : undefined,
			state: episodeArgs.episodeIncState ? await this.state(orm, o.id, DBObjectType.episode, user.id) : undefined
		};
	}

	episodeStatus(o: ORMEpisode): EpisodeUpdateStatus {
		return this.episodeService.isDownloading(o.id) ? {status: PodcastStatus.downloading} : {status: o.status, error: o.error};
	}

}

import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {PodcastStatus} from '../../utils/feed';
import {IApiBinaryResult} from '../../typings';
import {JamRequest} from '../../api/jam/api';
import {BaseController} from '../base/base.controller';
import {formatEpisode} from './episode.format';
import {StreamService} from '../stream/stream.service';
import {formatState} from '../state/state.format';
import {StateStore} from '../state/state.store';
import {StateService} from '../state/state.service';
import {ImageService} from '../image/image.service';
import {DownloadService} from '../download/download.service';
import {EpisodeStore, SearchQueryEpisode} from './episode.store';
import {PodcastService} from '../podcast/podcast.service';
import {Episode} from './episode.model';
import {User} from '../user/user.model';

export function defaultEpisodesSort(episodes: Array<Episode>): Array<Episode> {
	return episodes.sort((a, b) => {
			if (!a.tag) {
				return -1;
			}
			if (!b.tag) {
				return 1;
			}
			if (a.tag.track !== undefined && b.tag.track !== undefined) {
				const res = a.tag.track - b.tag.track;
				if (res !== 0) {
					return res;
				}
			}
			return a.title.localeCompare(b.title);
		}
	);
}

export class EpisodeController extends BaseController<JamParameters.Episode, JamParameters.Episodes, JamParameters.IncludesEpisode, SearchQueryEpisode, JamParameters.EpisodeSearch, Episode, Jam.PodcastEpisode> {

	constructor(
		private episodeStore: EpisodeStore,
		private podcastService: PodcastService,
		private streamService: StreamService,
		protected stateStore: StateStore,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(episodeStore, DBObjectType.episode, stateStore, stateService, imageService, downloadService);
	}

	async prepare(episode: Episode, includes: JamParameters.IncludesEpisode, user: User): Promise<Jam.PodcastEpisode> {
		const result = formatEpisode(episode, includes,
			this.podcastService.isDownloadingPodcastEpisode(episode.id) ? PodcastStatus.downloading : episode.status
		);
		if (includes.trackState) {
			const state = await this.stateStore.findOrCreate(episode.id, user.id, DBObjectType.episode);
			result.state = formatState(state);
		}
		return result;
	}

	translateQuery(query: JamParameters.EpisodeSearch, user: User): SearchQueryEpisode {
		return {
			query: query.query,
			title: query.title,
			podcastID: query.podcastID,
			status: query.status,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async retrieve(req: JamRequest<JamParameters.ID>): Promise<void> {
		const episode = await this.byID(req.query.id);
		if (!episode.path) {
			this.podcastService.downloadPodcastEpisode(episode); // do not wait
		}
	}

	async stream(req: JamRequest<JamParameters.Stream>): Promise<IApiBinaryResult> {
		const episode = await this.byID(req.query.id);
		return await this.streamService.getObjStream(episode, req.query.format, req.query.maxBitRate, req.user);
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.PodcastEpisodeStatus> {
		const episode = await this.byID(req.query.id);
		return {
			status: this.podcastService.isDownloadingPodcastEpisode(episode.id) ? PodcastStatus.downloading : episode.status
		};
	}

}

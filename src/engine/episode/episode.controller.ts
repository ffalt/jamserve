import {JamRequest} from '../../api/jam/api';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {PodcastStatus} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {BaseListController} from '../base/dbobject-list.controller';
import {DownloadService} from '../download/download.service';
import {ImageService} from '../image/image.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {StreamController} from '../stream/stream.controller';
import {User} from '../user/user.model';
import {formatEpisode} from './episode.format';
import {Episode} from './episode.model';
import {EpisodeService} from './episode.service';
import {SearchQueryEpisode} from './episode.store';

export class EpisodeController extends BaseListController<JamParameters.Episode,
	JamParameters.Episodes,
	JamParameters.IncludesEpisode,
	SearchQueryEpisode,
	JamParameters.EpisodeSearch,
	Episode,
	Jam.PodcastEpisode,
	JamParameters.PodcastEpisodeList> {

	constructor(
		private episodeService: EpisodeService,
		private streamController: StreamController,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(episodeService, stateService, imageService, downloadService);
	}

	defaultSort(items: Array<Episode>): Array<Episode> {
		return items.sort((a, b) => {
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
				return a.date - b.date;
			}
		);
	}

	async prepare(episode: Episode, includes: JamParameters.IncludesEpisode, user: User): Promise<Jam.PodcastEpisode> {
		const result = formatEpisode(episode, includes,
			this.episodeService.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status
		);
		if (includes.trackState) {
			const state = await this.stateService.findOrCreate(episode.id, user.id, DBObjectType.episode);
			result.state = formatState(state);
		}
		return result;
	}

	async translateQuery(query: JamParameters.EpisodeSearch, user: User): Promise<SearchQueryEpisode> {
		return {
			query: query.query,
			name: query.name,
			id: query.id,
			ids: query.ids,
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
			this.episodeService.downloadEpisode(episode); // do not wait
		}
	}

	async stream(req: JamRequest<JamParameters.Stream>): Promise<ApiBinaryResult> {
		const episode = await this.byID(req.query.id);
		return this.streamController.streamEpisode(episode, req.query.format, req.query.maxBitRate, req.user);
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.PodcastEpisodeStatus> {
		const episode = await this.byID(req.query.id);
		return {
			status: this.episodeService.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status
		};
	}

}

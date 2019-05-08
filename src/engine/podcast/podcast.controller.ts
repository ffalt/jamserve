import {JamRequest} from '../../api/jam/api';
import {DBObjectType} from '../../db/db.types';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {PodcastStatus} from '../../model/jam-types';
import {BaseListController} from '../base/dbobject-list.controller';
import {DownloadService} from '../download/download.service';
import {EpisodeController} from '../episode/episode.controller';
import {ImageService} from '../image/image.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {User} from '../user/user.model';
import {formatPodcast} from './podcast.format';
import {Podcast} from './podcast.model';
import {PodcastService} from './podcast.service';
import {SearchQueryPodcast} from './podcast.store';

export class PodcastController extends BaseListController<JamParameters.Podcast,
	JamParameters.Podcasts,
	JamParameters.IncludesPodcast,
	SearchQueryPodcast,
	JamParameters.PodcastSearch,
	Podcast,
	Jam.Podcast,
	JamParameters.PodcastList> {

	constructor(
		private podcastService: PodcastService,
		private episodeController: EpisodeController,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(podcastService, stateService, imageService, downloadService);
	}

	defaultSort(items: Array<Podcast>): Array<Podcast> {
		return items.sort((a, b) => (a.tag && a.tag.title ? a.tag.title : a.url).localeCompare((b.tag && b.tag.title ? b.tag.title : b.url)));
	}

	async prepare(podcast: Podcast, includes: JamParameters.IncludesPodcast, user: User): Promise<Jam.Podcast> {
		const result = formatPodcast(podcast, this.podcastService.isDownloading(podcast.id) ? PodcastStatus.downloading : podcast.status);
		if (includes.podcastState) {
			const state = await this.stateService.findOrCreate(podcast.id, user.id, DBObjectType.podcast);
			result.state = formatState(state);
		}
		if (includes.podcastEpisodes) {
			result.episodes = await this.episodeController.prepareByQuery({podcastID: podcast.id}, includes, user);
		}
		return result;
	}

	async translateQuery(query: JamParameters.PodcastSearch, user: User): Promise<SearchQueryPodcast> {
		return {
			query: query.query,
			id: query.id,
			ids: query.ids,
			url: query.url,
			title: query.title,
			status: query.status,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<Array<Jam.PodcastEpisode>> {
		return this.episodeController.prepareByQuery({podcastIDs: req.query.ids}, req.query, req.user);
	}

	async refreshAll(req: JamRequest<{}>): Promise<void> {
		this.podcastService.refreshPodcasts(); // do not wait
	}

	async refresh(req: JamRequest<JamParameters.ID>): Promise<void> {
		const podcast = await this.byID(req.query.id);
		this.podcastService.refresh(podcast); // do not wait
	}

	async create(req: JamRequest<JamParameters.PodcastNew>): Promise<Jam.Podcast> {
		const podcast = await this.podcastService.create(req.query.url);
		this.podcastService.refresh(podcast); // do not wait
		return this.prepare(podcast, {}, req.user);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const podcast = await this.byID(req.query.id);
		await this.podcastService.remove(podcast);
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.PodcastStatus> {
		const podcast = await this.byID(req.query.id);
		return {
			lastCheck: podcast.lastCheck,
			status: (this.podcastService.isDownloading(podcast.id) ? PodcastStatus[PodcastStatus.downloading] : PodcastStatus[podcast.status]) as Jam.PodcastStatusType
		};
	}

}

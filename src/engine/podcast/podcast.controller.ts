import {BaseController} from '../base/base.controller';
import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {DBObjectType} from '../../types';
import {PodcastStatus} from '../../utils/feed';
import {JamRequest} from '../../api/jam/api';
import {EpisodeController, defaultEpisodesSort} from '../episode/epsiode.controller';
import {formatPodcast} from './podcast.format';
import {StateStore} from '../state/state.store';
import {EpisodeStore} from '../episode/episode.store';
import {PodcastService} from './podcast.service';
import {formatState} from '../state/state.format';
import {StateService} from '../state/state.service';
import {ImageService} from '../image/image.service';
import {DownloadService} from '../download/download.service';
import {PodcastStore, SearchQueryPodcast} from './podcast.store';
import {Podcast} from './podcast.model';
import {User} from '../user/user.model';

export class PodcastController extends BaseController<JamParameters.Podcast, JamParameters.Podcasts, JamParameters.IncludesPodcast, SearchQueryPodcast, JamParameters.PodcastSearch, Podcast, Jam.Podcast> {

	constructor(
		private podcastStore: PodcastStore,
		private podcastService: PodcastService,
		private episodeController: EpisodeController,
		protected stateStore: StateStore,
		private episodeStore: EpisodeStore,
		protected stateService: StateService,
		protected imageService: ImageService,
		protected downloadService: DownloadService
	) {
		super(podcastStore, DBObjectType.podcast, stateStore, stateService, imageService, downloadService);
	}

	async prepare(podcast: Podcast, includes: JamParameters.IncludesPodcast, user: User): Promise<Jam.Podcast> {
		const result = formatPodcast(podcast, this.podcastService.isDownloadingPodcast(podcast.id) ? PodcastStatus.downloading : podcast.status);
		if (includes.podcastState) {
			const state = await this.stateService.findOrCreate(podcast.id, user.id, DBObjectType.podcast);
			result.state = formatState(state);
		}
		if (includes.podcastEpisodes) {
			let episodes = await this.episodeStore.search({podcastID: podcast.id});
			episodes = defaultEpisodesSort(episodes);
			result.episodes = await this.episodeController.prepareList(episodes, includes, user);
		}
		return result;
	}

	translateQuery(query: JamParameters.PodcastSearch, user: User): SearchQueryPodcast {
		return {
			query: query.query,
			url: query.url,
			title: query.title,
			status: query.status,
			offset: query.offset,
			amount: query.amount,
			sorts: query.sortField ? [{field: query.sortField, descending: !!query.sortDescending}] : undefined
		};
	}

	async tracks(req: JamRequest<JamParameters.Tracks>): Promise<Array<Jam.PodcastEpisode>> {
		const episodes = await this.episodeStore.search({podcastIDs: req.query.ids});
		return this.episodeController.prepareList(episodes, req.query, req.user);
	}

	async refreshAll(req: JamRequest<{}>): Promise<void> {
		this.podcastService.refreshPodcasts(); // do not wait
	}

	async refresh(req: JamRequest<JamParameters.ID>): Promise<void> {
		const podcast = await this.byID(req.query.id);
		this.podcastService.refreshPodcast(podcast); // do not wait
	}

	async create(req: JamRequest<JamParameters.PodcastNew>): Promise<Jam.Podcast> {
		const podcast = await this.podcastService.addPodcast(req.query.url);
		return this.prepare(podcast, {}, req.user);
	}

	async delete(req: JamRequest<JamParameters.ID>): Promise<void> {
		const podcast = await this.byID(req.query.id);
		await this.podcastService.removePodcast(podcast);
	}

	async status(req: JamRequest<JamParameters.ID>): Promise<Jam.PodcastStatus> {
		const podcast = await this.byID(req.query.id);
		return {
			lastCheck: podcast.lastCheck,
			status: this.podcastService.isDownloadingPodcast(podcast.id) ? PodcastStatus.downloading : podcast.status
		};
	}
}

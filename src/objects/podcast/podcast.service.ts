import {Feed} from '../../utils/feed';
import Logger from '../../utils/logger';
import {DBObjectType, PodcastStatus} from '../../types';
import {Podcast} from './podcast.model';
import {Episode} from '../episode/episode.model';
import {PodcastStore} from './podcast.store';
import {EpisodeService} from '../episode/episode.service';
import {DebouncePromises} from '../../utils/debounce-promises';

const log = Logger('PodcastService');

export class PodcastService {
	private podcastRefreshDebounce = new DebouncePromises<void>();

	constructor(public podcastStore: PodcastStore, private episodeService: EpisodeService) {
	}

	isDownloading(podcastId: string): boolean {
		return this.podcastRefreshDebounce.isPending(podcastId);
	}

	async create(url: string): Promise<Podcast> {
		const podcast: Podcast = {
			id: '',
			type: DBObjectType.podcast,
			created: Date.now(),
			lastCheck: 0,
			url: url,
			status: PodcastStatus.new
		};
		podcast.id = await this.podcastStore.add(podcast);
		return podcast;
	}

	async remove(podcast: Podcast): Promise<void> {
		await this.podcastStore.remove(podcast.id);
		await this.episodeService.removePodcastEpisodes(podcast.id);
	}

	async refresh(podcast: Podcast): Promise<void> {
		if (this.podcastRefreshDebounce.isPending(podcast.id)) {
			return this.podcastRefreshDebounce.append(podcast.id);
		}
		this.podcastRefreshDebounce.setPending(podcast.id);
		try {
			log.debug('Refreshing Podcast', podcast.url);
			const feed = new Feed();
			let episodes: Array<Episode> = [];
			try {
				const result = await feed.get(podcast);
				if (result) {
					podcast.tag = result.tag;
					episodes = result.episodes;
				}
				podcast.status = PodcastStatus.completed;
				podcast.errorMessage = undefined;
			} catch (e) {
				log.info('Refreshing Podcast failed', e);
				podcast.status = PodcastStatus.error;
				podcast.errorMessage = (e || '').toString();
			}
			podcast.lastCheck = Date.now();
			await this.podcastStore.replace(podcast);
			const newEpisodes = await this.episodeService.mergePodcastEpisodes(podcast.id, episodes);
			log.info(podcast.url + ': New Episodes: ' + newEpisodes.length);
			await this.podcastRefreshDebounce.resolve(podcast.id, undefined);
		} catch (e) {
			await this.podcastRefreshDebounce.resolve(podcast.id, undefined);
			return Promise.reject(e);
		}
	}

	async refreshPodcasts(): Promise<void> {
		log.info('Refreshing');
		const podcasts = await this.podcastStore.all();
		for (const podcast of podcasts) {
			await this.refresh(podcast);
		}
		log.info('Refreshed');
	}
}

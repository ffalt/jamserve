import {Feed, PodcastStatus} from '../../utils/feed';
import Logger from '../../utils/logger';
import {DBObjectType} from '../../types';
import {Podcast} from './podcast.model';
import {Episode} from '../episode/episode.model';
import {PodcastStore} from './podcast.store';
import {EpisodeService} from '../episode/episode.service';

const log = Logger('PodcastService');

export class PodcastService {
	podstate: {
		[id: string]: any;
	} = {};

	constructor(public podcastStore: PodcastStore, private episodeService: EpisodeService) {
	}

	isDownloadingPodcast(podcastId: string): boolean {
		return !!this.podstate[podcastId];
	}

	isDownloadingPodcastEpisode(podcastEpisodeId: string): boolean {
		return !!this.podstate[podcastEpisodeId];
	}

	async refreshPodcast(podcast: Podcast): Promise<void> {
		log.debug('Refreshing Podcast', podcast.url);
		this.podstate[podcast.id] = podcast;
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
			log.error('Refreshing Podcast', e);
			podcast.status = PodcastStatus.error;
			podcast.errorMessage = (e || '').toString();
		}
		podcast.lastCheck = Date.now();
		await this.podcastStore.replace(podcast);
		const newEpisodes = await this.episodeService.mergePodcastEpisodes(podcast.id, episodes);
		log.info(podcast.url + ': New Episodes: ' + newEpisodes.length);
		delete this.podstate[podcast.id];
	}

	async refreshPodcasts(): Promise<void> {
		log.info('Refreshing');
		const podcasts = await
			this.podcastStore.all();
		for (const podcast of podcasts) {
			await this.refreshPodcast(podcast);
		}
		log.info('Refreshed');
	}

	async addPodcast(url: string): Promise<Podcast> {
		const podcast: Podcast = {
			id: '',
			type: DBObjectType.podcast,
			created: Date.now(),
			lastCheck: 0,
			url: url,
			status: PodcastStatus.fresh
		};
		podcast.id = await this.podcastStore.add(podcast);
		return podcast;
	}

	async removePodcast(podcast: Podcast): Promise<void> {
		await this.podcastStore.remove(podcast.id);
		await this.episodeService.removePodcastEpisodes(podcast.id);
	}

}

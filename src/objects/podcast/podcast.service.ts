import {Feed} from '../../utils/feed';
import Logger from '../../utils/logger';
import {PodcastStatus} from '../../model/jam-types';
import {Podcast} from './podcast.model';
import {Episode} from '../episode/episode.model';
import {PodcastStore, SearchQueryPodcast} from './podcast.store';
import {EpisodeService} from '../episode/episode.service';
import {DebouncePromises} from '../../utils/debounce-promises';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';
import {DBObjectType} from '../../db/db.types';
import path from 'path';
import fse from 'fs-extra';
import {ImageModule} from '../../modules/image/image.module';
import {pathDeleteIfExists} from '../../utils/fs-utils';
import {IApiBinaryResult} from '../../typings';

const log = Logger('PodcastService');

export class PodcastService extends BaseListService<Podcast, SearchQueryPodcast> {
	private podcastRefreshDebounce = new DebouncePromises<void>();

	constructor(private podcastsPath: string, public podcastStore: PodcastStore, private episodeService: EpisodeService, private imageModule: ImageModule, stateService: StateService) {
		super(podcastStore, stateService);
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
		await this.episodeService.removeEpisodes(podcast.id);
		const p = path.resolve(this.podcastsPath, podcast.id);
		await pathDeleteIfExists(p);
		await this.imageModule.clearImageCacheByID(podcast.id);
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
			if (!podcast.image && podcast.tag && podcast.tag.image) {
				log.info('Try downloading Podcast image');
				const podcastPath = path.resolve(this.podcastsPath, podcast.id);
				await fse.ensureDir(podcastPath);
				try {
					podcast.image = await this.imageModule.storeImage(podcastPath, 'cover', podcast.tag.image);
				} catch (e) {
					podcast.image = undefined;
					log.info('Downloading Podcast image failed', e);
				}
			}
			await this.podcastStore.replace(podcast);
			const newEpisodes = await this.episodeService.mergeEpisodes(podcast.id, episodes);
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

	async getPodcastImage(podcast: Podcast, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (podcast.image) {
			return this.imageModule.get(podcast.id, path.join(this.podcastsPath, podcast.id, podcast.image), size, format);
		}
	}
}

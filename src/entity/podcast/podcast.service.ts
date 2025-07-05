import fse from 'fs-extra';
import path from 'path';
import { ImageModule } from '../../modules/image/image.module.js';
import { DebouncePromises } from '../../utils/debounce-promises.js';
import { pathDeleteIfExists } from '../../utils/fs-utils.js';
import { logger } from '../../utils/logger.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { Podcast } from './podcast.js';
import { PodcastStatus } from '../../types/enums.js';
import { ConfigService } from '../../modules/engine/services/config.service.js';
import { Episode } from '../episode/episode.js';
import { EpisodeData, Feed, PodcastTag } from './podcast-feed.js';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { EpisodeService } from '../episode/episode.service.js';
import { GpodderPodcast, GpodderTag } from '../../modules/audio/clients/gpodder-rest-data.js';
import { PageResult } from '../base/base.js';
import { paginate } from '../base/base.utils.js';
import { PageArgs } from '../base/base.args.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';

const log = logger('PodcastService');

@InRequestScope
export class PodcastService {
	private readonly podcastRefreshDebounce = new DebouncePromises<void>();
	private readonly podcastsPath: string;
	@Inject
	private readonly imageModule!: ImageModule;

	@Inject
	private readonly audioModule!: AudioModule;

	@Inject
	private readonly configService!: ConfigService;

	@Inject
	private readonly episodeService!: EpisodeService;

	constructor() {
		this.podcastsPath = this.configService.getDataPath(['podcasts']);
	}

	isDownloading(podcastId: string): boolean {
		return this.podcastRefreshDebounce.isPending(podcastId);
	}

	async create(orm: Orm, url: string): Promise<Podcast> {
		const podcast: Podcast = orm.Podcast.create({
			lastCheck: new Date(),
			url,
			name: url,
			categories: [],
			status: PodcastStatus.new
		});
		await orm.Podcast.persistAndFlush(podcast);
		return podcast;
	}

	async remove(orm: Orm, podcast: Podcast): Promise<void> {
		const p = path.resolve(this.podcastsPath, podcast.id);
		await this.episodeService.removeEpisodes(orm, podcast.id);
		await orm.Podcast.removeAndFlush(podcast);
		await pathDeleteIfExists(p);
		await this.imageModule.clearImageCacheByIDs([podcast.id]);
	}

	private async mergeEpisodes(orm: Orm, podcast: Podcast, episodes: Array<EpisodeData>): Promise<Array<Episode>> {
		if (!episodes?.length) {
			return [];
		}
		const newEpisodes: Array<Episode> = [];
		const oldEpisodes = await podcast.episodes.getItems();
		for (const epi of episodes) {
			let episode = oldEpisodes.find(e => e.guid === epi.guid);
			if (!episode) {
				episode = orm.Episode.create({
					...epi,
					chapters: undefined,
					enclosures: undefined,
					status: PodcastStatus.new
				});
				newEpisodes.push(episode);
			}
			await episode.podcast.set(podcast);
			episode.duration = epi.duration !== undefined ? epi.duration * 1000 : undefined;
			episode.chaptersJSON = epi.chapters && epi.chapters.length > 0 ? JSON.stringify(epi.chapters) : undefined;
			episode.enclosuresJSON = epi.enclosures && epi.enclosures.length > 0 ? JSON.stringify(epi.enclosures) : undefined;
			episode.date = epi.date ? epi.date : episode.date;
			episode.summary = epi.summary;
			episode.name = epi.name || episode.name;
			episode.guid = epi.guid || epi.link;
			episode.author = epi.author;
			orm.Episode.persistLater(episode);
		}
		await orm.em.flush();
		return newEpisodes;
	}

	private async updatePodcast(orm: Orm, podcast: Podcast, tag: PodcastTag, episodes: Array<EpisodeData>): Promise<void> {
		podcast.name = tag.title || podcast.name;
		podcast.author = tag.author;
		podcast.description = tag.description;
		podcast.title = tag.title;
		podcast.link = tag.link;
		podcast.generator = tag.generator;
		podcast.language = tag.language;
		podcast.categories = tag.categories || [];
		if (podcast.image) {
			const imageFile = path.resolve(this.podcastsPath, podcast.id, podcast.image);
			if (!(await fse.pathExists(imageFile))) {
				podcast.image = undefined;
			}
		}
		if (!podcast.image && tag.image) {
			log.info('Try downloading Podcast image');
			const podcastPath = path.resolve(this.podcastsPath, podcast.id);
			await fse.ensureDir(podcastPath);
			try {
				podcast.image = await this.imageModule.storeImage(podcastPath, 'cover', tag.image);
			} catch (e) {
				podcast.image = undefined;
				log.info('Downloading Podcast image failed', e);
			}
		}
		const newEpisodes = await this.mergeEpisodes(orm, podcast, episodes);
		log.info(`${podcast.url}: New Episodes: ${newEpisodes.length}`);
	}

	async refresh(orm: Orm, podcast: Podcast): Promise<void> {
		if (this.podcastRefreshDebounce.isPending(podcast.id)) {
			return this.podcastRefreshDebounce.append(podcast.id);
		}
		this.podcastRefreshDebounce.setPending(podcast.id);
		try {
			log.debug('Refreshing Podcast', podcast.url);
			const feed = new Feed();
			try {
				const result = await feed.get(podcast);
				if (result) {
					await this.updatePodcast(orm, podcast, result.tag, result.episodes);
					podcast.status = PodcastStatus.completed;
				} else {
					podcast.status = PodcastStatus.error;
					podcast.errorMessage = 'No Podcast Feed Data';
				}
			} catch (e) {
				log.info('Refreshing Podcast failed', e);
				podcast.status = PodcastStatus.error;
				podcast.errorMessage = (e || '').toString();
			}
			podcast.lastCheck = new Date();
			await orm.Podcast.persistAndFlush(podcast);
			this.podcastRefreshDebounce.resolve(podcast.id, undefined);
		} catch (e) {
			this.podcastRefreshDebounce.resolve(podcast.id, undefined);
			return Promise.reject(e as Error);
		}
	}

	async refreshPodcasts(orm: Orm): Promise<void> {
		log.info('Refreshing');
		const podcasts = await orm.Podcast.all();
		for (const podcast of podcasts) {
			await this.refresh(orm, podcast);
		}
		log.info('Refreshed');
	}

	async getImage(orm: Orm, podcast: Podcast, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (podcast.image) {
			return this.imageModule.get(podcast.id, path.join(this.podcastsPath, podcast.id, podcast.image), size, format);
		}
		return;
	}

	async getEpisodeImage(orm: Orm, episode: Episode, size: number | undefined, format: string | undefined): Promise<ApiBinaryResult | undefined> {
		const result = await this.episodeService.getImage(episode, size, format);
		if (!result) {
			return this.getImage(orm, await episode.podcast.getOrFail(), size, format);
		}
		return result;
	}

	async discoverTags(page: PageArgs): Promise<PageResult<GpodderTag>> {
		const list = await this.audioModule.gpodder.tags(1000);
		return paginate(list, page);
	}

	async discoverByTag(tag: string, page: PageArgs): Promise<PageResult<GpodderPodcast>> {
		const list = await this.audioModule.gpodder.byTag(tag, 100);
		return paginate(list, page);
	}

	async discover(name: string): Promise<Array<GpodderPodcast>> {
		return this.audioModule.gpodder.search(name);
	}

	async discoverTop(page: PageArgs): Promise<PageResult<GpodderPodcast>> {
		const list = await this.audioModule.gpodder.top(300);
		return paginate(list, page);
	}
}

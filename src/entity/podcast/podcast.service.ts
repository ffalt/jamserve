import fse from 'fs-extra';
import path from 'path';
import {ImageModule} from '../../modules/image/image.module';
import {DebouncePromises} from '../../utils/debounce-promises';
import {pathDeleteIfExists} from '../../utils/fs-utils';
import {logger} from '../../utils/logger';
import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {Podcast} from './podcast';
import {PodcastStatus} from '../../types/enums';
import {ConfigService} from '../../modules/engine/services/config.service';
import {Episode} from '../episode/episode';
import {EpisodeData, Feed, PodcastTag} from './podcast-feed';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {AudioModule} from '../../modules/audio/audio.module';
import {EpisodeService} from '../episode/episode.service';

const log = logger('PodcastService');

@Singleton
export class PodcastService {
	private podcastRefreshDebounce = new DebouncePromises<void>();
	private readonly podcastsPath: string;
	@Inject
	private imageModule!: ImageModule;
	@Inject
	private audioModule!: AudioModule;
	@Inject
	private configService!: ConfigService;
	@Inject
	private episodeService!: EpisodeService;
	@Inject
	private orm!: OrmService;

	constructor() {
		this.podcastsPath = this.configService.getDataPath(['podcasts']);
	}

	isDownloading(podcastId: string): boolean {
		return this.podcastRefreshDebounce.isPending(podcastId);
	}

	async create(url: string): Promise<Podcast> {
		const podcast: Podcast = this.orm.Podcast.create({
			lastCheck: 0,
			url,
			name: url,
			categories: [],
			status: PodcastStatus.new
		});
		await this.orm.orm.em.persistAndFlush(podcast);
		return podcast;
	}

	async remove(podcast: Podcast): Promise<void> {
		const p = path.resolve(this.podcastsPath, podcast.id);
		await this.episodeService.removeEpisodes(podcast.id);
		await this.orm.Podcast.removeLater(podcast);
		await this.orm.orm.em.flush();
		await pathDeleteIfExists(p);
		await this.imageModule.clearImageCacheByIDs([podcast.id]);
	}

	private async mergeEpisodes(podcast: Podcast, episodes: Array<EpisodeData>): Promise<Array<Episode>> {
		if ((!episodes) || (!episodes.length)) {
			return [];
		}
		const newEpisodes: Array<Episode> = [];
		const oldEpisodes = podcast.episodes.getItems();
		for (const epi of episodes) {
			let episode = oldEpisodes.find(e => e.guid === epi.guid);
			if (!episode) {
				episode = this.orm.Episode.create({
					...epi,
					chapters: undefined,
					enclosures: undefined,
					status: PodcastStatus.new,
					podcast
				})
				newEpisodes.push(episode);
			}
			episode.podcast = podcast;
			episode.duration = epi.duration !== undefined ? epi.duration * 1000 : undefined;
			episode.chaptersJSON = epi.chapters && epi.chapters.length > 0 ? JSON.stringify(epi.chapters) : undefined;
			episode.enclosuresJSON = epi.enclosures && epi.enclosures.length > 0 ? JSON.stringify(epi.enclosures) : undefined;
			episode.date = epi.date ? epi.date.valueOf() : episode.date;
			episode.summary = epi.summary;
			episode.name = epi.name || episode.name;
			episode.guid = epi.guid || epi.link;
			episode.author = epi.author;
			this.orm.orm.em.persistLater(episode);
		}
		await this.orm.orm.em.flush();
		return newEpisodes;
	}

	private async updatePodcast(podcast: Podcast, tag: PodcastTag, episodes: Array<EpisodeData>): Promise<void> {
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
		const newEpisodes = await this.mergeEpisodes(podcast, episodes);
		log.info(`${podcast.url}: New Episodes: ${newEpisodes.length}`);
	}

	async refresh(podcast: Podcast): Promise<void> {
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
					await this.updatePodcast(podcast, result.tag, result.episodes);
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
			podcast.lastCheck = Date.now();
			await this.orm.orm.em.persistAndFlush(podcast);
			this.podcastRefreshDebounce.resolve(podcast.id, undefined);
		} catch (e) {
			this.podcastRefreshDebounce.resolve(podcast.id, undefined);
			return Promise.reject(e);
		}
	}

	async refreshPodcasts(): Promise<void> {
		log.info('Refreshing');
		const podcasts = await this.orm.Podcast.all();
		for (const podcast of podcasts) {
			await this.refresh(podcast);
		}
		log.info('Refreshed');
	}

	async getImage(podcast: Podcast, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (podcast.image) {
			return this.imageModule.get(podcast.id, path.join(this.podcastsPath, podcast.id, podcast.image), size, format);
		}
	}

	async getEpisodeImage(episode: Episode, size: number | undefined, format: string | undefined): Promise<ApiBinaryResult | undefined> {
		const result = await this.episodeService.getImage(episode, size, format);
		if (!result) {
			return this.getImage(episode.podcast, size, format);
		}
		return result;
	}

}

import fse from 'fs-extra';
import path from 'path';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {downloadFile} from '../../utils/download';
import {SupportedAudioFormat} from '../../utils/filetype';
import {fileDeleteIfExists, fileSuffix} from '../../utils/fs-utils';
import {logger} from '../../utils/logger';
import {Inject, InRequestScope} from 'typescript-ioc';
import {DebouncePromises} from '../../utils/debounce-promises';
import {Orm} from '../../modules/engine/services/orm.service';
import {Episode, EpisodeEnclosure} from './episode';
import {AudioFormatType, PodcastStatus} from '../../types/enums';
import {ApiBinaryResult} from '../../modules/rest';
import {ConfigService} from '../../modules/engine/services/config.service';

const log = logger('EpisodeService');

@InRequestScope
export class EpisodeService {
	private episodeDownloadDebounce = new DebouncePromises<void>();
	private readonly podcastsPath: string;
	@Inject
	private audioModule!: AudioModule;
	@Inject
	private imageModule!: ImageModule;
	@Inject
	private configService!: ConfigService;

	constructor() {
		this.podcastsPath = this.configService.getDataPath(['podcasts']);
	}

	isDownloading(podcastEpisodeId: string): boolean {
		return this.episodeDownloadDebounce.isPending(podcastEpisodeId);
	}

	private async downloadEpisodeFile(episode: Episode): Promise<string> {
		let url = '';
		const enclosures: Array<EpisodeEnclosure> | undefined = episode.enclosuresJSON ? JSON.parse(episode.enclosuresJSON) : undefined;
		if (enclosures && enclosures.length > 0) {
			url = enclosures[0].url;
		} else {
			throw new Error('No podcast episode url found');
		}
		let suffix = fileSuffix(url);
		if (suffix.includes('?')) {
			suffix = suffix.slice(0, suffix.indexOf('?'));
		}
		if (!SupportedAudioFormat.includes(suffix as AudioFormatType)) {
			throw new Error(`Unsupported Podcast audio format .${suffix}`);
		}
		const podcastID = episode.podcast.idOrFail();
		const p = path.resolve(this.podcastsPath, podcastID);
		await fse.ensureDir(p);
		const filename = path.join(p, `${episode.id}.${suffix}`);
		log.info('retrieving file', url);
		await downloadFile(url, filename);
		return filename;
	}

	async downloadEpisode(orm: Orm, episode: Episode): Promise<void> {
		if (this.episodeDownloadDebounce.isPending(episode.id)) {
			return this.episodeDownloadDebounce.append(episode.id);
		}
		this.episodeDownloadDebounce.setPending(episode.id);
		try {
			try {
				const filename = await this.downloadEpisodeFile(episode);
				const stat = await fse.stat(filename);
				const result = await this.audioModule.read(filename);
				const oldTag = await episode.tag.get();
				if (oldTag) {
					orm.Tag.removeLater(oldTag);
				}
				const tag = orm.Tag.create({...result, chapters: result.chapters ? JSON.stringify(result.chapters) : undefined});
				orm.Tag.persistLater(tag);
				await episode.tag.set(tag);
				episode.status = PodcastStatus.completed;
				episode.statCreated = stat.ctime.valueOf();
				episode.statModified = stat.mtime.valueOf();
				episode.fileSize = stat.size;
				episode.duration = result.mediaDuration;
				episode.path = filename;
			} catch (e) {
				episode.status = PodcastStatus.error;
				episode.error = (e || '').toString();
			}
			await orm.Episode.persistAndFlush(episode);
			this.episodeDownloadDebounce.resolve(episode.id, undefined);
		} catch (e) {
			this.episodeDownloadDebounce.resolve(episode.id, undefined);
			return Promise.reject(e);
		}
	}

	async removeEpisodes(orm: Orm, podcastID: string): Promise<void> {
		const removeEpisodes = await orm.Episode.find({where: {podcast: podcastID}});
		await this.imageModule.clearImageCacheByIDs(removeEpisodes.map(it => it.id));
		for (const episode of removeEpisodes) {
			orm.Episode.removeLater(episode);
			if (episode.path) {
				await fileDeleteIfExists(episode.path);
			}
		}
	}

	async deleteEpisode(orm: Orm, episode: Episode): Promise<void> {
		if (!episode.path) {
			return;
		}
		await fileDeleteIfExists(episode.path);
		const tag = await episode.tag.get();
		if (tag) {
			orm.Tag.removeLater(tag);
		}
		await episode.tag.set(undefined);
		episode.path = undefined;
		episode.statCreated = undefined;
		episode.statModified = undefined;
		episode.fileSize = undefined;
		episode.status = PodcastStatus.deleted;
		await orm.Episode.persistAndFlush(episode);
	}

	async getImage(episode: Episode, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (!episode.path) {
			return;
		}
		const tag = await episode.tag.get();
		if (tag && tag.nrTagImages) {
			const result = await this.imageModule.getExisting(episode.id, size, format);
			if (result) {
				return result;
			}
			try {
				const buffer = await this.audioModule.extractTagImage(episode.path);
				if (buffer) {
					return await this.imageModule.getBuffer(episode.id, buffer, size, format);
				}
			} catch (e) {
				log.error('getImage', 'Extracting image from audio failed: ' + episode.path);
			}
		}

	}

	async countEpisodes(orm: Orm, podcastID: string): Promise<number> {
		return await orm.Episode.count({where: {podcast: podcastID}});
	}
}

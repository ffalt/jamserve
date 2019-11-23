import fse from 'fs-extra';
import path from 'path';
import {AudioFormatType, PodcastStatus} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {ImageModule} from '../../modules/image/image.module';
import {ApiBinaryResult} from '../../typings';
import {DebouncePromises} from '../../utils/debounce-promises';
import {downloadFile} from '../../utils/download';
import {SupportedAudioFormat} from '../../utils/filetype';
import {fileDeleteIfExists, fileSuffix} from '../../utils/fs-utils';
import {logger} from '../../utils/logger';
import {BaseListService} from '../base/dbobject-list.service';
import {StateService} from '../state/state.service';
import {Episode} from './episode.model';
import {EpisodeStore, SearchQueryEpisode} from './episode.store';

const log = logger('EpisodeService');

export class EpisodeService extends BaseListService<Episode, SearchQueryEpisode> {
	private episodeDownloadDebounce = new DebouncePromises<void>();

	constructor(private podcastsPath: string, public episodeStore: EpisodeStore, stateService: StateService, private audioModule: AudioModule, private imageModule: ImageModule) {
		super(episodeStore, stateService);
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
				return b.date - a.date;
			}
		);
	}

	isDownloading(podcastEpisodeId: string): boolean {
		return this.episodeDownloadDebounce.isPending(podcastEpisodeId);
	}

	private async downloadEpisodeFile(episode: Episode): Promise<string> {
		let url = '';
		if (episode.enclosures && episode.enclosures.length > 0) {
			url = episode.enclosures[0].url;
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
		const p = path.resolve(this.podcastsPath, episode.podcastID);
		await fse.ensureDir(p);
		const filename = path.join(p, `${episode.id}.${suffix}`);
		log.info('retrieving file', url);
		await downloadFile(url, filename);
		return filename;
	}

	async downloadEpisode(episode: Episode): Promise<void> {
		if (this.episodeDownloadDebounce.isPending(episode.id)) {
			return this.episodeDownloadDebounce.append(episode.id);
		}
		this.episodeDownloadDebounce.setPending(episode.id);
		try {
			try {
				const filename = await this.downloadEpisodeFile(episode);
				const stat = await fse.stat(filename);
				const result = await this.audioModule.read(filename);
				episode.status = PodcastStatus.completed;
				episode.tag = result.tag;
				episode.media = result.media;
				episode.stat = {
					created: stat.ctime.valueOf(),
					modified: stat.mtime.valueOf(),
					size: stat.size
				};
				episode.path = filename;
			} catch (e) {
				episode.status = PodcastStatus.error;
				episode.error = (e || '').toString();
			}
			await this.episodeStore.replace(episode);
			this.episodeDownloadDebounce.resolve(episode.id, undefined);
		} catch (e) {
			this.episodeDownloadDebounce.resolve(episode.id, undefined);
			return Promise.reject(e);
		}
	}

	async removeEpisodes(podcastID: string): Promise<void> {
		const removeEpisodes = await this.episodeStore.search({podcastID});
		const ids = removeEpisodes.items.map(episode => episode.id);
		await this.episodeStore.remove(ids);
		for (const episode of removeEpisodes.items) {
			if (episode.path) {
				await fileDeleteIfExists(episode.path);
			}
		}
	}

	async deleteEpisode(episode: Episode): Promise<void> {
		if (!episode.path) {
			return;
		}
		await fileDeleteIfExists(episode.path);
		episode.path = undefined;
		episode.stat = undefined;
		episode.media = undefined;
		episode.status = PodcastStatus.deleted;
		await this.episodeStore.replace(episode);
	}

	async mergeEpisodes(podcastID: string, podcast: string, episodes: Array<Episode>): Promise<Array<Episode>> {
		if ((!episodes) || (!episodes.length)) {
			return [];
		}
		const storeEpisodes: Array<Episode> = [];
		const newEpisodes: Array<Episode> = [];
		const oldEpisodes = await this.episodeStore.search({podcastID});
		for (const epi of episodes) {
			const update = oldEpisodes.items.find(e => e.guid === epi.guid);
			if (update) {
				update.podcast = podcast;
				update.duration = epi.duration;
				update.chapters = epi.chapters;
				update.date = epi.date;
				update.summary = epi.summary;
				update.name = epi.name;
				update.guid = epi.guid;
				update.author = epi.author;
				update.enclosures = epi.enclosures;
				storeEpisodes.push(update);
			} else {
				epi.podcast = podcast;
				storeEpisodes.push(epi);
				newEpisodes.push(epi);
			}
		}
		await this.episodeStore.upsert(storeEpisodes);
		return newEpisodes;
	}

	async getEpisodeImage(episode: Episode, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (episode.tag && episode.tag.nrTagImages && episode.path) {
			const result = await this.imageModule.getExisting(episode.id, size, format);
			if (result) {
				return result;
			}
			const buffer = await this.audioModule.extractTagImage(episode.path);
			if (buffer) {
				return this.imageModule.getBuffer(episode.id, buffer, size, format);
			}
		}
	}

}

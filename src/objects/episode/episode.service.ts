import {fileDeleteIfExists, fileSuffix, pathDeleteIfExists} from '../../utils/fs-utils';
import {SupportedAudioFormat} from '../../utils/filetype';
import path from 'path';
import Logger from '../../utils/logger';
import {AudioModule} from '../../modules/audio/audio.module';
import {downloadFile} from '../../utils/download';
import fse from 'fs-extra';
import {EpisodeStore, SearchQueryEpisode} from './episode.store';
import {Episode, PodcastEpisodeChapter, PodcastEpisodeEnclosure} from './episode.model';
import {AudioFormatType, PodcastStatus} from '../../model/jam-types';
import {DebouncePromises} from '../../utils/debounce-promises';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';

const log = Logger('EpisodeService');

export class EpisodeService extends BaseListService<Episode, SearchQueryEpisode> {
	private episodeDownloadDebounce = new DebouncePromises<void>();

	constructor(private podcastsPath: string, public episodeStore: EpisodeStore, stateService: StateService, private audioModule: AudioModule) {
		super(episodeStore, stateService);
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
		const suffix = fileSuffix(url);
		if (SupportedAudioFormat.indexOf(<AudioFormatType>suffix) < 0) {
			throw new Error('Unsupported Podcast audio format');
		}
		const p = path.resolve(this.podcastsPath, episode.podcastID);
		await fse.ensureDir(p);
		const filename = path.join(p, episode.id + '.' + suffix);
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
			await this.episodeDownloadDebounce.resolve(episode.id, undefined);
		} catch (e) {
			await this.episodeDownloadDebounce.resolve(episode.id, undefined);
			return Promise.reject(e);
		}
	}

	async removeEpisodes(podcastID: string): Promise<void> {
		const removeEpisodes = await this.episodeStore.search({podcastID});
		const ids = removeEpisodes.map(episode => episode.id);
		await this.episodeStore.remove(ids);
		for (const episode of removeEpisodes) {
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

	async mergeEpisodes(podcastID: string, episodes: Array<Episode>): Promise<Array<Episode>> {
		if ((!episodes) || (!episodes.length)) {
			return [];
		}
		const storeEpisodes: Array<Episode> = [];
		const oldEpisodes = await this.episodeStore.search({podcastID});
		for (const epi of episodes) {
			const update = oldEpisodes.find(e => e.link === epi.link);
			if (update) {
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
				storeEpisodes.push(epi);
			}
		}
		await this.episodeStore.upsert(storeEpisodes);
		return episodes;
	}

}

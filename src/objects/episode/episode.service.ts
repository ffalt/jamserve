import {fileDeleteIfExists, fileSuffix} from '../../utils/fs-utils';
import {SupportedAudioFormat} from '../../utils/filetype';
import path from 'path';
import Logger from '../../utils/logger';
import {AudioModule} from '../../engine/audio/audio.module';
import {downloadFile} from '../../utils/download';
import fse from 'fs-extra';
import {EpisodeStore} from './episode.store';
import {Episode} from './episode.model';
import {PodcastStatus} from '../../types';

const log = Logger('EpisodeService');

export class EpisodeService {
	podstate: {
		[id: string]: any;
	} = {};

	constructor(private podcastsPath: string, public episodeStore: EpisodeStore, private audioModule: AudioModule) {
	}

	isDownloadingPodcastEpisode(podcastEpisodeId: string): boolean {
		return !!this.podstate[podcastEpisodeId];
	}

	async downloadPodcastEpisode(episode: Episode): Promise<void> {
		try {
			this.podstate[episode.id] = episode;
			let url = '';
			if (episode.enclosures && episode.enclosures.length > 0) {
				url = episode.enclosures[0].url;
			} else {
				return Promise.reject(Error('No podcast episode url found'));
			}
			const ext = fileSuffix(url);
			if (SupportedAudioFormat.indexOf(ext) < 0) {
				return Promise.reject(Error('Unsupported Podcast audio format'));
			}
			const p = path.resolve(this.podcastsPath, episode.podcastID);
			await fse.ensureDir(p);
			const filename = path.join(p, episode.id + '.' + (ext || 'mp3'));
			log.info('retrieving file', url);
			await downloadFile(url, filename);
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
			log.info('updating episode', filename);
			await this.episodeStore.replace(episode);
			delete this.podstate[episode.id];
		} catch (e) {
			console.error(e);
			episode.status = PodcastStatus.error;
			episode.error = (e || '').toString();
			delete this.podstate[episode.id];
			return this.episodeStore.replace(episode);
		}
	}

	async removePodcastEpisodes(podcastID: string): Promise<void> {
		const removeEpisodes = await this.episodeStore.search({podcastID});
		const ids = removeEpisodes.map(episode => episode.id);
		await this.episodeStore.remove(ids);
		for (const episode of removeEpisodes) {
			if (episode.path) {
				await fileDeleteIfExists(episode.path);
			}
		}
	}

	async deletePodcastEpisodeFile(episode: Episode): Promise<void> {
		if (episode.path) {
			await fileDeleteIfExists(episode.path);
			episode.path = undefined;
			episode.stat = undefined;
			episode.media = undefined;
			episode.status = PodcastStatus.skipped;
			await this.episodeStore.replace(episode);
		}

	}

	async mergePodcastEpisodes(podcastID: string, episodes: Array<Episode>): Promise<Array<Episode>> {
		if ((!episodes) || (!episodes.length)) {
			return [];
		}
		const epi = await this.episodeStore.search({podcastID});
		const links = epi.map(e => e.link);
		episodes = episodes.filter(e => links.indexOf(e.link) < 0);
		await this.episodeStore.upsert(episodes);
		return episodes;
	}

}

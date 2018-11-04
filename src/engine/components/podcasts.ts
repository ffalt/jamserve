import {JamServe} from '../../model/jamserve';
import {Store} from '../../store/store';
import {Feed, PodcastStatus} from '../../utils/feed';
import {fileDeleteIfExists, fileSuffix, fsStat, makePath} from '../../utils/fs-utils';
import {SupportedAudioFormat} from '../../utils/filetype';
import path from 'path';
import Logger from '../../utils/logger';
import {Audio} from '../../audio/audio';
import {DBObjectType} from '../../types';
import {downloadFile} from '../../utils/download';
import {Config} from '../../config';

const log = Logger('Podcasts');

export class Podcasts {
	private readonly audio: Audio;
	private readonly store: Store;
	private readonly podcastsPath: string;
	podstate: {
		[id: string]: any;
	} = {};

	constructor(config: Config, store: Store, audio: Audio) {
		this.audio = audio;
		this.podcastsPath = config.getDataPath(['podcasts']);
		this.store = store;
	}

	isDownloadingPodcast(podcastId: string): boolean {
		return !!this.podstate[podcastId];
	}

	isDownloadingPodcastEpisode(podcastEpisodeId: string): boolean {
		return !!this.podstate[podcastEpisodeId];
	}

	async mergePodcastEpisodes(podcast: JamServe.Podcast, episodes: Array<JamServe.Episode>): Promise<void> {
		if ((!episodes) || (!episodes.length)) {
			return;
		}
		const epi = await this.store.episode.search({podcastID: podcast.id});
		const links = epi.map(e => e.link);
		episodes = episodes.filter(e => links.indexOf(e.link) < 0);
		log.info(podcast.url + ': ' + episodes.length + ' new episodes');
		await this.store.episode.upsert(episodes);
	}

	async downloadPodcastEpisode(episode: JamServe.Episode): Promise<void> {
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
			await makePath(p);
			const filename = path.join(p, episode.id + '.' + (ext || 'mp3'));
			log.info('retrieving file', url);
			await downloadFile(url, filename);
			const stat = await fsStat(filename);
			const result = await this.audio.read(filename);
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
			await this.store.episode.replace(episode);
			delete this.podstate[episode.id];
		} catch (e) {
			console.error(e);
			episode.status = PodcastStatus.error;
			episode.error = (e || '').toString();
			delete this.podstate[episode.id];
			return this.store.episode.replace(episode);
		}
	}

	async refreshPodcast(podcast: JamServe.Podcast): Promise<void> {
		log.debug('Refreshing Podcast', podcast.url);
		this.podstate[podcast.id] = podcast;
		const feed = new Feed();
		let episodes: Array<JamServe.Episode> = [];
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
		await this.store.podcast.replace(podcast);
		await this.mergePodcastEpisodes(podcast, episodes);
		delete this.podstate[podcast.id];
	}

	async refreshPodcasts(): Promise<void> {
		log.info('Refreshing');
		const podcasts = await
			this.store.podcast.all();
		for (const podcast of podcasts) {
			await this.refreshPodcast(podcast);
		}
		log.info('Refreshed');
	}

	async addPodcast(url: string): Promise<JamServe.Podcast> {
		const podcast: JamServe.Podcast = {
			id: '',
			type: DBObjectType.podcast,
			created: Date.now(),
			lastCheck: 0,
			url: url,
			status: PodcastStatus.fresh
		};
		podcast.id = await this.store.podcast.add(podcast);
		return podcast;
	}

	async removePodcast(podcast: JamServe.Podcast): Promise<void> {
		await this.store.podcast.remove(podcast.id);
		const removeEpisodes = await this.store.episode.search({podcastID: podcast.id});
		const ids = removeEpisodes.map(episode => episode.id);
		await this.store.episode.remove(ids);
		for (const episode of removeEpisodes) {
			if (episode.path) {
				await fileDeleteIfExists(episode.path);
			}
		}
	}

	async deletePodcastEpisode(episode: JamServe.Episode): Promise<void> {
		if (episode.path) {
			await fileDeleteIfExists(episode.path);
			episode.path = undefined;
			episode.stat = undefined;
			episode.media = undefined;
			episode.status = PodcastStatus.skipped;
			await this.store.episode.replace(episode);
		}

	}
}

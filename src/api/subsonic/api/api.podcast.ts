import {Episode} from '../../../engine/episode/episode.model';
import {Podcast} from '../../../engine/podcast/podcast.model';
import {PodcastStatus} from '../../../model/jam-types';
import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {logger} from '../../../utils/logger';
import {paginate} from '../../../utils/paginate';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

const log = logger('SubsonicApi');

export class SubsonicPodcastApi extends SubsonicApiBase {

	/**
	 * Requests the server to check for new Podcast episodes. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/refreshPodcasts.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async refreshPodcasts(req: ApiOptions<{}>): Promise<void> {
		this.engine.podcastService.refreshPodcasts().catch(e => log.error(e)); // do not wait
	}

	/**
	 * Adds a new Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/createPodcastChannel.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async createPodcastChannel(req: ApiOptions<SubsonicParameters.PodcastChannel>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 url 	Yes 		The URL of the Podcast to add.
		 */
		await this.engine.podcastService.create(req.query.url);
	}

	/**
	 * Returns all Podcast channels the server subscribes to, and (optionally) their episodes. This method can also be used to return details for only one channel - refer to the id parameter.
	 * A typical use case for this method would be to first retrieve all channels without episodes, and then retrieve all episodes for the single channel the user selects.
	 * Since 1.6.0
	 * http://your-server/rest/getPodcasts.view
	 * @return Returns a <subsonic-response> element with a nested <podcasts> element on success.
	 */
	async getPodcasts(req: ApiOptions<SubsonicParameters.PodcastChannels>): Promise<{ podcasts: Subsonic.Podcasts }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 includeEpisodes 	No 	true 	(Since 1.9.0) Whether to include Podcast episodes in the returned result.
		 id 	No 		(Since 1.9.0) If specified, only return the Podcast channel with this ID.
		 */
		let includeEpisodes = false;
		if (req.query.includeEpisodes !== undefined) {
			includeEpisodes = req.query.includeEpisodes;
		}
		let podcastList: Array<Podcast> = [];
		if (req.query.id) {
			const podcast = await this.engine.store.podcastStore.byId(req.query.id);
			if (podcast) {
				podcastList.push(podcast);
			} else {
				return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
			}
		} else {
			podcastList = await this.engine.store.podcastStore.all();
		}
		const channel = podcastList.map(podcast => FORMAT.packPodcast(podcast, (this.engine.podcastService.isDownloading(podcast.id) ? PodcastStatus.downloading : undefined)));
		const podcasts: Subsonic.Podcasts = {channel};
		if (includeEpisodes) {
			for (const podcast of channel) {
				const episodes = await this.engine.store.episodeStore.search({podcastID: podcast.id, sorts: [{field: 'date', descending: true}]});
				podcast.episode = await this.prepareEpisodes(episodes.items, req.user);
			}
		}
		return {podcasts};
	}

	/**
	 * Returns the most recently published Podcast episodes.
	 * Since 1.13.0
	 * http://your-server/rest/getNewestPodcasts.view
	 * @return Returns a <subsonic-response> element with a nested <newestPodcasts> element on success.
	 */
	async getNewestPodcasts(req: ApiOptions<SubsonicParameters.PodcastEpisodesNewest>): Promise<{ newestPodcasts: Subsonic.NewestPodcasts }> {
		/*
		Parameter 	Required 	Default 	Comment
		count 	No 	20 	The maximum number of episodes to return.
		 */
		// TODO: do this with a limit & sort db request
		const episodes = this.engine.episodeService.defaultSort(await this.engine.store.episodeStore.all());
		const newestPodcasts: Subsonic.NewestPodcasts = {};
		newestPodcasts.episode = await this.prepareEpisodes(paginate(episodes, req.query.count || 20, 0).items, req.user);
		return {newestPodcasts};
	}

	/**
	 * Deletes a Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/deletePodcastChannel.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async deletePodcastChannel(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast channel to delete.
		 */
		const podcast = await this.byID<Podcast>(req.query.id, this.engine.store.podcastStore);
		await this.engine.podcastService.remove(podcast);
	}

	/**
	 * Request the server to start downloading a given Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/downloadPodcastEpisode.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async downloadPodcastEpisode(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to download.
		 */
		const episode = await this.byID<Episode>(req.query.id, this.engine.store.episodeStore);
		if (!episode.path) {
			this.engine.episodeService.downloadEpisode(episode).catch(e => log.error(e)); // do not wait
		}
	}

	/**
	 * Deletes a Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/deletePodcastEpisode.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async deletePodcastEpisode(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to delete.
		 */
		const episode = await this.byID<Episode>(req.query.id, this.engine.store.episodeStore);
		await this.engine.episodeService.deleteEpisode(episode);
	}

}

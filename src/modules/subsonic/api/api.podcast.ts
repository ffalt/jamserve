import { Podcast } from '../../../entity/podcast/podcast.js';
import { SubsonicParameterID, SubsonicParameterPodcastChannel, SubsonicParameterPodcastChannels, SubsonicParameterPodcastEpisodesNewest } from '../model/subsonic-rest-params.js';
import { logger } from '../../../utils/logger.js';
import { SubsonicApiBase } from './api.base.js';
import { EpisodeOrderFields, PodcastStatus } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicNewestPodcasts, SubsonicPodcasts, SubsonicResponseNewestPodcasts, SubsonicResponsePodcasts } from '../model/subsonic-rest-data.js';

const log = logger('SubsonicApi');

export class SubsonicPodcastApi extends SubsonicApiBase {

	/**
	 * Returns all Podcast channels the server subscribes to, and (optionally) their episodes. This method can also be used to return details for only one channel - refer to the id parameter.
	 * A typical use case for this method would be to first retrieve all channels without episodes, and then retrieve all episodes for the single channel the user selects.
	 * Since 1.6.0
	 * http://your-server/rest/getPodcasts.view
	 * @return Returns a <subsonic-response> element with a nested <podcasts> element on success.
	 */
	@SubsonicRoute('getPodcasts.view', () => SubsonicResponsePodcasts, {
		summary: 'Get Podcasts',
		description: 'Returns all Podcast channels the server subscribes to, and (optionally) their episodes.',
		tags: ['Podcasts']
	})
	async getPodcasts(@SubsonicParams() query: SubsonicParameterPodcastChannels, { orm, engine, user }: Context): Promise<SubsonicResponsePodcasts> {
		/*
		 Parameter 	Required 	Default 	Comment
		 includeEpisodes 	No 	true 	(Since 1.9.0) Whether to include Podcast episodes in the returned result.
		 id 	No 		(Since 1.9.0) If specified, only return the Podcast channel with this ID.
		 */
		let includeEpisodes = false;
		if (query.includeEpisodes !== undefined) {
			includeEpisodes = query.includeEpisodes;
		}
		let podcastList: Array<Podcast> = [];
		if (query.id) {
			const podcast = await orm.Podcast.findOneOrFailByID(query.id);
			podcastList.push(podcast);
		} else {
			podcastList = await orm.Podcast.all();
		}
		const channel = await Promise.all(podcastList.map(async podcast => {
			const pod = await this.format.packPodcast(podcast, (engine.podcast.isDownloading(podcast.id) ? PodcastStatus.downloading : undefined));
			if (includeEpisodes) {
				pod.episode = await this.prepareEpisodes(engine, orm, await podcast.episodes.getItems({ order: ['date', 'DESC'] }), user);
			}
			return pod;
		}));
		const podcasts: SubsonicPodcasts = { channel };
		return { podcasts };
	}

	/**
	 * Returns the most recently published Podcast episodes.
	 * Since 1.13.0
	 * http://your-server/rest/getNewestPodcasts.view
	 * @return Returns a <subsonic-response> element with a nested <newestPodcasts> element on success.
	 */
	@SubsonicRoute('getNewestPodcasts.view', () => SubsonicResponseNewestPodcasts, {
		summary: 'Get Newest Podcast Episodes',
		description: 'Returns the most recently published Podcast episodes.',
		tags: ['Podcasts']
	})
	async getNewestPodcasts(@SubsonicParams() query: SubsonicParameterPodcastEpisodesNewest, { orm, engine, user }: Context): Promise<SubsonicResponseNewestPodcasts> {
		/*
		Parameter 	Required 	Default 	Comment
		count 	No 	20 	The maximum number of episodes to return.
		 */
		const episodes = await orm.Episode.findFilter({},
			[{ orderBy: EpisodeOrderFields.date, orderDesc: true }], { take: query.count || 20, skip: query.offset || 0 },
			user);
		const newestPodcasts: SubsonicNewestPodcasts = {};
		newestPodcasts.episode = await this.prepareEpisodes(engine, orm, episodes, user);
		return { newestPodcasts };
	}

	/**
	 * Adds a new Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/createPodcastChannel.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('createPodcastChannel.view', {
		summary: 'Create Podcasts',
		description: 'Adds a new Podcast channel.',
		tags: ['Podcasts']
	})
	async createPodcastChannel(@SubsonicParams() query: SubsonicParameterPodcastChannel, { orm, engine }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 url 	Yes 		The URL of the Podcast to add.
		 */
		await engine.podcast.create(orm, query.url);
	}

	/**
	 * Deletes a Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/deletePodcastChannel.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('deletePodcastChannel.view', {
		summary: 'Delete Podcasts',
		description: 'Deletes a Podcast channel.',
		tags: ['Podcasts']
	})
	async deletePodcastChannel(@SubsonicParams() query: SubsonicParameterID, { orm, engine }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast channel to delete.
		 */
		const podcast = await this.subsonicORM.findOneOrFailByID(query.id, orm.Podcast);
		engine.podcast.remove(orm, podcast).catch(e => log.error(e));
	}

	/**
	 * Requests the server to check for new Podcast episodes. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/refreshPodcasts.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('refreshPodcasts.view', {
		summary: 'Refresh Podcasts',
		description: 'Requests the server to check for new Podcast episodes.',
		tags: ['Podcasts']
	})
	async refreshPodcasts(_query: unknown, { orm, engine }: Context): Promise<void> {
		engine.podcast.refreshPodcasts(orm).catch(e => log.error(e)); // do not wait
	}

	/**
	 * Request the server to start downloading a given Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/downloadPodcastEpisode.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('downloadPodcastEpisode.view', {
		summary: 'Download Podcast Episode',
		description: 'Request the server to start downloading a given Podcast episode.',
		tags: ['Podcasts']
	})
	async downloadPodcastEpisode(@SubsonicParams() query: SubsonicParameterID, { orm, engine }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to download.
		 */
		const episode = await this.subsonicORM.findOneOrFailByID(query.id, orm.Episode);
		if (!episode.path) {
			engine.episode.downloadEpisode(orm, episode).catch(e => log.error(e)); // do not wait
		}
	}

	/**
	 * Deletes a Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 * http://your-server/rest/deletePodcastEpisode.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('deletePodcastEpisode.view', {
		summary: 'Delete Podcast Episode',
		description: 'Deletes a Podcast episode.',
		tags: ['Podcasts']
	})
	async deletePodcastEpisode(@SubsonicParams() query: SubsonicParameterID, { orm, engine }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to delete.
		 */
		const episode = await this.subsonicORM.findOneOrFailByID(query.id, orm.Episode);
		await engine.episode.deleteEpisode(orm, episode);
	}

}

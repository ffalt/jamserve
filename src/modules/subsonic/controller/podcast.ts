import { Podcast } from '../../../entity/podcast/podcast.js';
import { SubsonicParameterID, SubsonicParameterPodcastChannel, SubsonicParameterPodcastChannels, SubsonicParameterPodcastEpisodesNewest } from '../model/subsonic-rest-params.js';
import { logger } from '../../../utils/logger.js';

import { EpisodeOrderFields, PodcastStatus } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicNewestPodcasts, SubsonicOKResponse, SubsonicPodcastChannel, SubsonicPodcasts, SubsonicResponseNewestPodcasts, SubsonicResponsePodcasts } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';

const log = logger('SubsonicApi');

@SubsonicController()
export class SubsonicPodcastApi {

	/**
	 * Returns all Podcast channels the server subscribes to, and (optionally) their episodes. This method can also be used to return details for only one channel - refer to the id parameter.
	 * A typical use case for this method would be to first retrieve all channels without episodes, and then retrieve all episodes for the single channel the user selects.
	 * Since 1.6.0
	 */
	@SubsonicRoute('/getPodcasts.view', () => SubsonicResponsePodcasts, {
		summary: 'Get Podcasts',
		description: 'Returns all Podcast channels the server subscribes to, and (optionally) their episodes.',
		tags: ['Podcasts']
	})
	async getPodcasts(@SubsonicParams() query: SubsonicParameterPodcastChannels, @SubsonicCtx() { orm, engine, user }: Context): Promise<SubsonicResponsePodcasts> {
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
		const channel: Array<SubsonicPodcastChannel> = [];
		for (const podcast of podcastList) {
			const pod = await SubsonicFormatter.packPodcast(orm, podcast, (engine.podcast.isDownloading(podcast.id) ? PodcastStatus.downloading : undefined));
			if (includeEpisodes) {
				pod.episode = await SubsonicHelper.prepareEpisodes(engine, orm, await podcast.episodes.getItems({ order: ['date', 'DESC'] }), user);
			}
			channel.push(pod);
		}
		const podcasts: SubsonicPodcasts = { channel };
		return { podcasts };
	}

	/**
	 * Returns the most recently published Podcast episodes.
	 * Since 1.13.0
	 */
	@SubsonicRoute('/getNewestPodcasts.view', () => SubsonicResponseNewestPodcasts, {
		summary: 'Get Newest Podcast Episodes',
		description: 'Returns the most recently published Podcast episodes.',
		tags: ['Podcasts']
	})
	async getNewestPodcasts(@SubsonicParams() query: SubsonicParameterPodcastEpisodesNewest, @SubsonicCtx() { orm, engine, user }: Context): Promise<SubsonicResponseNewestPodcasts> {
		/*
		Parameter 	Required 	Default 	Comment
		count 	No 	20 	The maximum number of episodes to return.
		 */
		const episodes = await orm.Episode.findFilter({},
			[{ orderBy: EpisodeOrderFields.date, orderDesc: true }], { take: query.count || 20, skip: query.offset || 0 },
			user);
		const newestPodcasts: SubsonicNewestPodcasts = {};
		newestPodcasts.episode = await SubsonicHelper.prepareEpisodes(engine, orm, episodes, user);
		return { newestPodcasts };
	}

	/**
	 * Adds a new Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 */
	@SubsonicRoute('/createPodcastChannel.view', () => SubsonicOKResponse, {
		summary: 'Create Podcasts',
		description: 'Adds a new Podcast channel.',
		tags: ['Podcasts']
	})
	async createPodcastChannel(@SubsonicParams() query: SubsonicParameterPodcastChannel, @SubsonicCtx() { orm, engine }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 url 	Yes 		The URL of the Podcast to add.
		 */
		await engine.podcast.create(orm, query.url);
		return {};
	}

	/**
	 * Deletes a Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 */
	@SubsonicRoute('/deletePodcastChannel.view', () => SubsonicOKResponse, {
		summary: 'Delete Podcasts',
		description: 'Deletes a Podcast channel.',
		tags: ['Podcasts']
	})
	async deletePodcastChannel(@SubsonicParams() query: SubsonicParameterID, { orm, engine }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast channel to delete.
		 */
		const podcast = await orm.Subsonic.findOneSubsonicOrFailByID(query.id, orm.Podcast);
		engine.podcast.remove(orm, podcast).catch(e => log.error(e));
		return {};
	}

	/**
	 * Requests the server to check for new Podcast episodes. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 */
	@SubsonicRoute('/refreshPodcasts.view', () => SubsonicOKResponse, {
		summary: 'Refresh Podcasts',
		description: 'Requests the server to check for new Podcast episodes.',
		tags: ['Podcasts']
	})
	async refreshPodcasts(@SubsonicCtx() { orm, engine }: Context): Promise<SubsonicOKResponse> {
		engine.podcast.refreshPodcasts(orm).catch(e => log.error(e)); // do not wait
		return {};
	}

	/**
	 * Request the server to start downloading a given Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 */
	@SubsonicRoute('/downloadPodcastEpisode.view', () => SubsonicOKResponse, {
		summary: 'Download Podcast Episode',
		description: 'Request the server to start downloading a given Podcast episode.',
		tags: ['Podcasts']
	})
	async downloadPodcastEpisode(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, engine }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to download.
		 */
		const episode = await orm.Subsonic.findOneSubsonicOrFailByID(query.id, orm.Episode);
		if (!episode.path) {
			engine.episode.downloadEpisode(orm, episode).catch(e => log.error(e)); // do not wait
		}
		return {};
	}

	/**
	 * Deletes a Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
	 * Since 1.9.0
	 */
	@SubsonicRoute('/deletePodcastEpisode.view', () => SubsonicOKResponse, {
		summary: 'Delete Podcast Episode',
		description: 'Deletes a Podcast episode.',
		tags: ['Podcasts']
	})
	async deletePodcastEpisode(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, engine }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to delete.
		 */
		const episode = await orm.Subsonic.findOneSubsonicOrFailByID(query.id, orm.Episode);
		await engine.episode.deleteEpisode(orm, episode);
		return {};
	}
}

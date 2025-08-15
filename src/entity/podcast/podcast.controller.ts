import { Podcast, PodcastDiscover, PodcastDiscoverPage, PodcastDiscoverTagPage, PodcastIndex, PodcastPage, PodcastUpdateStatus } from './podcast.model.js';
import { UserRole } from '../../types/enums.js';
import { Episode, EpisodePage } from '../episode/episode.model.js';
import {
	IncludesPodcastParameters,
	IncludesPodcastChildrenParameters,
	PodcastCreateParameters,
	PodcastDiscoverParameters,
	PodcastDiscoverByTagParameters,
	PodcastFilterParameters,
	PodcastOrderParameters,
	PodcastRefreshParameters
} from './podcast.parameters.js';
import { EpisodeOrderParameters, IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { logger } from '../../utils/logger.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

const log = logger('PodcastController');

@Controller('/podcast', { tags: ['Podcast'], roles: [UserRole.stream] })
export class PodcastController {
	@Get(
		'/id',
		() => Podcast,
		{ description: 'Get a Podcast by Id', summary: 'Get Podcast' }
	)
	async id(
		@QueryParameter('id', { description: 'Podcast Id', isID: true }) id: string,
		@QueryParameters() podcastParameters: IncludesPodcastParameters,
		@QueryParameters() podcastChildrenParameters: IncludesPodcastChildrenParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Podcast> {
		return engine.transform.podcast(
			orm, await orm.Podcast.oneOrFailByID(id),
			podcastParameters, podcastChildrenParameters, episodeParameters, user
		);
	}

	@Get(
		'/index',
		() => PodcastIndex,
		{ description: 'Get the Navigation Index for Podcasts', summary: 'Get Index' }
	)
	async index(@QueryParameters() filter: PodcastFilterParameters, @RestContext() { orm, engine, user }: Context): Promise<PodcastIndex> {
		const result = await orm.Podcast.indexFilter(filter, user);
		return engine.transform.Podcast.podcastIndex(orm, result);
	}

	@Get(
		'/search',
		() => PodcastPage,
		{ description: 'Search Podcasts' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() podcastParameters: IncludesPodcastParameters,
		@QueryParameters() podcastChildrenParameters: IncludesPodcastChildrenParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@QueryParameters() filter: PodcastFilterParameters,
		@QueryParameters() order: PodcastOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<PodcastPage> {
		if (list.list) {
			return await orm.Podcast.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.podcast(orm, o, podcastParameters, podcastChildrenParameters, episodeParameters, user)
			);
		}
		return await orm.Podcast.searchTransformFilter<Podcast>(
			filter, [order], page, user,
			o => engine.transform.podcast(orm, o, podcastParameters, podcastChildrenParameters, episodeParameters, user)
		);
	}

	@Get(
		'/episodes',
		() => EpisodePage,
		{ description: 'Get Episodes of Podcasts', summary: 'Get Episodes' }
	)
	async episodes(
		@QueryParameters() page: PageParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@QueryParameters() filter: PodcastFilterParameters,
		@QueryParameters() order: EpisodeOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<EpisodePage> {
		const podcastIDs = await orm.Podcast.findIDsFilter(filter, user);
		return await orm.Episode.searchTransformFilter<Episode>(
			{ podcastIDs }, [order], page, user,
			o => engine.transform.Episode.episodeBase(orm, o, episodeParameters, user)
		);
	}

	@Get(
		'/status',
		() => PodcastUpdateStatus,
		{ description: 'Get a Podcast Status by Podcast Id', summary: 'Get Status' }
	)
	async status(
		@QueryParameter('id', { description: 'Podcast Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<PodcastUpdateStatus> {
		return engine.transform.Podcast.podcastStatus(await orm.Podcast.oneOrFailByID(id));
	}

	@Post(
		'/create',
		() => Podcast,
		{ description: 'Create a Podcast', roles: [UserRole.podcast], summary: 'Create Podcast' }
	)
	async create(
		@BodyParameters() { url }: PodcastCreateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Podcast> {
		const podcast = await engine.podcast.create(orm, url);
		engine.podcast.refresh(orm, podcast)
			.catch((error: unknown) => {
				log.error(error);
			}); // do not wait
		return engine.transform.podcast(orm, podcast, {}, {}, {}, user);
	}

	@Post(
		'/refresh',
		{ description: 'Check Podcast Feeds for new Episodes', roles: [UserRole.podcast], summary: 'Refresh Podcasts' }
	)
	async refresh(
		@BodyParameters() { id }: PodcastRefreshParameters,
		@RestContext() { orm, engine }: Context
	): Promise<void> {
		if (id) {
			const podcast = await orm.Podcast.oneOrFailByID(id);
			engine.podcast.refresh(orm, podcast)
				.catch((error: unknown) => {
					log.error(error);
				}); // do not wait
		} else {
			engine.podcast.refreshPodcasts(orm)
				.catch((error: unknown) => {
					log.error(error);
				}); // do not wait
		}
	}

	@Post(
		'/remove',
		{ description: 'Remove a Podcast', roles: [UserRole.podcast], summary: 'Remove Podcast' }
	)
	async remove(
		@BodyParameter('id', { description: 'Podcast ID to remove', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<void> {
		const podcast = await orm.Podcast.oneOrFailByID(id);
		await engine.podcast.remove(orm, podcast);
	}

	@Get(
		'/discover',
		() => [PodcastDiscover],
		{ description: 'Discover Podcasts via gpodder.net', summary: 'Discover Podcasts' }
	)
	async discover(@QueryParameters() { query }: PodcastDiscoverParameters, @RestContext() { engine }: Context): Promise<Array<PodcastDiscover>> {
		return await engine.podcast.discover(query);
	}

	@Get(
		'/discover/tags',
		() => PodcastDiscoverTagPage,
		{ description: 'Discover Podcast Tags via gpodder.net', summary: 'Discover Podcast Tags' }
	)
	async podcastsDiscoverTags(@QueryParameters() page: PageParameters, @RestContext() { engine }: Context): Promise<PodcastDiscoverTagPage> {
		return await engine.podcast.discoverTags(page);
	}

	@Get(
		'/discover/byTag',
		() => PodcastDiscoverTagPage,
		{ description: 'Discover Podcasts by Tag via gpodder.net', summary: 'Discover Podcasts by Tag' }
	)
	async podcastsDiscoverByTag(
		@QueryParameters() { tag }: PodcastDiscoverByTagParameters,
		@QueryParameters() page: PageParameters,
		@RestContext() { engine }: Context
	): Promise<PodcastDiscoverPage> {
		return await engine.podcast.discoverByTag(tag, page);
	}

	@Get(
		'/discover/top',
		() => PodcastDiscoverTagPage,
		{ description: 'Discover Top Podcasts via gpodder.net', summary: 'Discover Top Podcasts' }
	)
	async podcastsDiscoverTop(@QueryParameters() page: PageParameters, @RestContext() { engine }: Context): Promise<PodcastDiscoverPage> {
		return await engine.podcast.discoverTop(page);
	}
}

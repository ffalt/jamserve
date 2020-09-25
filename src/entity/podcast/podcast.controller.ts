import {Podcast, PodcastDiscover, PodcastDiscoverPage, PodcastDiscoverTagPage, PodcastIndex, PodcastPage, PodcastUpdateStatus} from './podcast.model';
import {BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {Episode, EpisodePage} from '../episode/episode.model';
import {IncludesPodcastArgs, IncludesPodcastChildrenArgs, PodcastCreateArgs, PodcastDiscoverArgs, PodcastDiscoverByTagArgs, PodcastFilterArgs, PodcastOrderArgs, PodcastRefreshArgs} from './podcast.args';
import {EpisodeOrderArgs, IncludesEpisodeArgs} from '../episode/episode.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {logger} from '../../utils/logger';
import {Context} from '../../modules/engine/rest/context';

const log = logger('PodcastController');

@Controller('/podcast', {tags: ['Podcast'], roles: [UserRole.stream]})
export class PodcastController {
	@Get(
		'/id',
		() => Podcast,
		{description: 'Get a Podcast by Id', summary: 'Get Podcast'}
	)
	async id(
		@QueryParam('id', {description: 'Podcast Id', isID: true}) id: string,
		@QueryParams() podcastArgs: IncludesPodcastArgs,
		@QueryParams() podcastChildrenArgs: IncludesPodcastChildrenArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Podcast> {
		return engine.transform.podcast(
			orm, await orm.Podcast.oneOrFailByID(id),
			podcastArgs, podcastChildrenArgs, episodeArgs, user
		);
	}

	@Get(
		'/index',
		() => PodcastIndex,
		{description: 'Get the Navigation Index for Podcasts', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: PodcastFilterArgs, @Ctx() {orm, engine, user}: Context): Promise<PodcastIndex> {
		const result = await orm.Podcast.indexFilter(filter, user);
		return engine.transform.podcastIndex(orm, result);
	}

	@Get(
		'/search',
		() => PodcastPage,
		{description: 'Search Podcasts'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() podcastArgs: IncludesPodcastArgs,
		@QueryParams() podcastChildrenArgs: IncludesPodcastChildrenArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() filter: PodcastFilterArgs,
		@QueryParams() order: PodcastOrderArgs,
		@QueryParams() list: ListArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<PodcastPage> {
		if (list.list) {
			return await orm.Podcast.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user)
			);
		}
		return await orm.Podcast.searchTransformFilter<Podcast>(
			filter, [order], page, user,
			o => engine.transform.podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user)
		);
	}

	@Get(
		'/episodes',
		() => EpisodePage,
		{description: 'Get Episodes of Podcasts', summary: 'Get Episodes'}
	)
	async episodes(
		@QueryParams() page: PageArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() filter: PodcastFilterArgs,
		@QueryParams() order: EpisodeOrderArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<EpisodePage> {
		const podcastIDs = await orm.Podcast.findIDsFilter(filter, user);
		return await orm.Episode.searchTransformFilter<Episode>(
			{podcastIDs}, [order], page, user,
			o => engine.transform.episodeBase(orm, o, episodeArgs, user)
		);
	}

	@Get(
		'/status',
		() => PodcastUpdateStatus,
		{description: 'Get a Podcast Status by Podcast Id', summary: 'Get Status'}
	)
	async status(
		@QueryParam('id', {description: 'Podcast Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<PodcastUpdateStatus> {
		return engine.transform.podcastStatus(await orm.Podcast.oneOrFailByID(id));
	}

	@Post(
		'/create',
		() => Podcast,
		{description: 'Create a Podcast', roles: [UserRole.podcast], summary: 'Create Podcast'}
	)
	async create(
		@BodyParams() args: PodcastCreateArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Podcast> {
		const podcast = await engine.podcast.create(orm, args.url);
		engine.podcast.refresh(orm, podcast).catch(e => log.error(e)); // do not wait
		return engine.transform.podcast(orm, podcast, {}, {}, {}, user);
	}

	@Post(
		'/refresh',
		{description: 'Check Podcast Feeds for new Episodes', roles: [UserRole.podcast], summary: 'Refresh Podcasts'}
	)
	async refresh(
		@BodyParams() args: PodcastRefreshArgs,
		@Ctx() {orm, engine}: Context
	): Promise<void> {
		if (args.id) {
			const podcast = await orm.Podcast.oneOrFailByID(args.id);
			engine.podcast.refresh(orm, podcast).catch(e => log.error(e)); // do not wait
		} else {
			engine.podcast.refreshPodcasts(orm).catch(e => log.error(e)); // do not wait
		}
	}

	@Post(
		'/remove',
		{description: 'Remove a Podcast', roles: [UserRole.podcast], summary: 'Remove Podcast'}
	)
	async remove(
		@BodyParam('id', {description: 'Podcast ID to remove', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<void> {
		const podcast = await orm.Podcast.oneOrFailByID(id);
		await engine.podcast.remove(orm, podcast);
	}

	@Get(
		'/discover',
		() => [PodcastDiscover],
		{description: 'Discover Podcasts via gpodder.net', summary: 'Discover Podcasts'}
	)
	async discover(@QueryParams() {query}: PodcastDiscoverArgs, @Ctx() {engine}: Context): Promise<Array<PodcastDiscover>> {
		return await engine.podcast.discover(query);
	}

	@Get(
		'/discover/tags',
		() => PodcastDiscoverTagPage,
		{description: 'Discover Podcast Tags via gpodder.net', summary: 'Discover Podcast Tags'}
	)
	async podcastsDiscoverTags(@QueryParams() page: PageArgs, @Ctx() {engine}: Context): Promise<PodcastDiscoverTagPage> {
		return await engine.podcast.discoverTags(page);
	}

	@Get(
		'/discover/byTag',
		() => PodcastDiscoverTagPage,
		{description: 'Discover Podcasts by Tag via gpodder.net', summary: 'Discover Podcasts by Tag'}
	)
	async podcastsDiscoverByTag(
		@QueryParams() {tag}: PodcastDiscoverByTagArgs,
		@QueryParams() page: PageArgs,
		@Ctx() {engine}: Context
	): Promise<PodcastDiscoverPage> {
		return await engine.podcast.discoverByTag(tag, page);
	}

	@Get(
		'/discover/top',
		() => PodcastDiscoverTagPage,
		{description: 'Discover Top Podcasts via gpodder.net', summary: 'Discover Top Podcasts'}
	)
	async podcastsDiscoverTop(@QueryParams() page: PageArgs, @Ctx() {engine}: Context): Promise<PodcastDiscoverPage> {
		return await engine.podcast.discoverTop(page);
	}

}

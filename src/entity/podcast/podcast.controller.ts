import {Podcast, PodcastIndex, PodcastPage, PodcastUpdateStatus} from './podcast.model';
import {BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {Episode, EpisodePage} from '../episode/episode.model';
import {IncludesPodcastArgs, IncludesPodcastChildrenArgs, PodcastCreateArgs, PodcastFilterArgs, PodcastOrderArgs, PodcastRefreshArgs} from './podcast.args';
import {EpisodeOrderArgs, IncludesEpisodeArgs} from '../episode/episode.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {InRequestScope, Inject} from 'typescript-ioc';
import {PodcastService} from './podcast.service';
import {logger} from '../../utils/logger';
import {Context} from '../../modules/engine/rest/context';

const log = logger('PodcastController');

@InRequestScope
@Controller('/podcast', {tags: ['Podcast'], roles: [UserRole.stream]})
export class PodcastController extends BaseController {
	@Inject
	podcastService!: PodcastService;

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
		@Ctx() {orm, user}: Context
	): Promise<Podcast> {
		return this.transform.podcast(
			orm, await orm.Podcast.oneOrFailByID(id),
			podcastArgs, podcastChildrenArgs, episodeArgs, user
		);
	}

	@Get(
		'/index',
		() => PodcastIndex,
		{description: 'Get the Navigation Index for Podcasts', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: PodcastFilterArgs, @Ctx() {orm, user}: Context): Promise<PodcastIndex> {
		const result = await orm.Podcast.indexFilter(filter, user);
		return this.transform.podcastIndex(orm, result);
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
		@Ctx() {orm, user}: Context
	): Promise<PodcastPage> {
		if (list.list) {
			return await orm.Podcast.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user)
			);
		}
		return await orm.Podcast.searchTransformFilter<Podcast>(
			filter, [order], page, user,
			o => this.transform.podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user)
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
		@Ctx() {orm, user}: Context
	): Promise<EpisodePage> {
		const podcastIDs = await orm.Podcast.findIDsFilter(filter, user);
		return await orm.Episode.searchTransformFilter<Episode>(
			{podcastIDs}, [order], page, user,
			o => this.transform.episodeBase(orm, o, episodeArgs, user)
		)
	}

	@Get(
		'/status',
		() => PodcastUpdateStatus,
		{description: 'Get a Podcast Status by Podcast Id', summary: 'Get Status'}
	)
	async status(
		@QueryParam('id', {description: 'Podcast Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<PodcastUpdateStatus> {
		return this.transform.podcastStatus(await orm.Podcast.oneOrFailByID(id));
	}

	@Post(
		'/create',
		() => Podcast,
		{description: 'Create a Podcast', roles: [UserRole.podcast], summary: 'Create Podcast'}
	)
	async create(
		@BodyParams() args: PodcastCreateArgs,
		@Ctx() {orm, user}: Context
	): Promise<Podcast> {
		const podcast = await this.podcastService.create(orm, args.url);
		this.podcastService.refresh(orm, podcast).catch(e => log.error(e)); // do not wait
		return this.transform.podcast(orm, podcast, {}, {}, {}, user);
	}

	@Post(
		'/refresh',
		{description: 'Check Podcast Feeds for new Episodes', roles: [UserRole.podcast], summary: 'Refresh Podcasts'}
	)
	async refresh(
		@BodyParams() args: PodcastRefreshArgs,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		if (args.id) {
			const podcast = await orm.Podcast.oneOrFailByID(args.id);
			this.podcastService.refresh(orm, podcast).catch(e => log.error(e)); // do not wait
		} else {
			this.podcastService.refreshPodcasts(orm).catch(e => log.error(e)); // do not wait
		}
	}

	@Post(
		'/remove',
		{description: 'Remove a Podcast', roles: [UserRole.podcast], summary: 'Remove Podcast'}
	)
	async remove(
		@BodyParam('id', {description: 'Podcast ID to remove', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		const podcast = await orm.Podcast.oneOrFailByID(id);
		await this.podcastService.remove(orm, podcast);
	}

}

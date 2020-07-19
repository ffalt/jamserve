import {Podcast, PodcastIndex, PodcastPage, PodcastUpdateStatus} from './podcast.model';
import {User} from '../user/user';
import {BodyParam, BodyParams, Controller, CurrentUser, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {Episode, EpisodePage} from '../episode/episode.model';
import {IncludesPodcastArgs, IncludesPodcastChildrenArgs, PodcastCreateArgs, PodcastFilterArgs, PodcastOrderArgs, PodcastRefreshArgs} from './podcast.args';
import {EpisodeOrderArgs, IncludesEpisodeArgs} from '../episode/episode.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {Inject} from 'typescript-ioc';
import {PodcastService} from './podcast.service';
import {logger} from '../../utils/logger';

const log = logger('PodcastController');

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
		@CurrentUser() user: User
	): Promise<Podcast> {
		return this.transform.podcast(
			await this.orm.Podcast.oneOrFail(id),
			podcastArgs, podcastChildrenArgs, episodeArgs, user
		);
	}

	@Get(
		'/index',
		() => PodcastIndex,
		{description: 'Get the Navigation Index for Podcasts', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: PodcastFilterArgs, @CurrentUser() user: User): Promise<PodcastIndex> {
		const result = await this.orm.Podcast.indexFilter(filter, user);
		return this.transform.podcastIndex(result);
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
		@CurrentUser() user: User
	): Promise<PodcastPage> {
		if (list.list) {
			return await this.orm.Podcast.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.podcast(o, podcastArgs, podcastChildrenArgs, episodeArgs, user)
			);
		}
		return await this.orm.Podcast.searchTransformFilter<Podcast>(
			filter, [order], page, user,
			o => this.transform.podcast(o, podcastArgs, podcastChildrenArgs, episodeArgs, user)
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
		@CurrentUser() user: User
	): Promise<EpisodePage> {
		const podcastIDs = await this.orm.Podcast.findIDsFilter(filter, user);
		return await this.orm.Episode.searchTransformFilter<Episode>(
			{podcastIDs}, [order], page, user,
			o => this.transform.episodeBase(o, episodeArgs, user)
		)
	}

	@Get(
		'/status',
		() => PodcastUpdateStatus,
		{description: 'Get a Podcast Status by Podcast Id', summary: 'Get Status'}
	)
	async status(@QueryParam('id', {description: 'Podcast Id', isID: true}) id: string): Promise<PodcastUpdateStatus> {
		return this.transform.podcastStatus(await this.orm.Podcast.oneOrFail(id));
	}

	@Post(
		'/create',
		() => Podcast,
		{description: 'Create a Podcast', roles: [UserRole.podcast], summary: 'Create Podcast'}
	)
	async create(
		@BodyParams() args: PodcastCreateArgs,
		@CurrentUser() user: User
	): Promise<Podcast> {
		const podcast = await this.podcastService.create(args.url);
		this.podcastService.refresh(podcast).catch(e => log.error(e)); // do not wait
		return this.transform.podcast(podcast, {}, {}, {}, user);
	}

	@Post(
		'/refresh',
		{description: 'Check Podcast Feeds for new Episodes', roles: [UserRole.podcast], summary: 'Refresh Podcasts'}
	)
	async refresh(@BodyParams() args: PodcastRefreshArgs): Promise<void> {
		if (args.id) {
			const podcast = await this.orm.Podcast.oneOrFail(args.id);
			this.podcastService.refresh(podcast).catch(e => log.error(e)); // do not wait
		} else {
			this.podcastService.refreshPodcasts().catch(e => log.error(e)); // do not wait
		}
	}

	@Post(
		'/remove',
		{description: 'Remove a Podcast', roles: [UserRole.podcast], summary: 'Remove Podcast'}
	)
	async remove(
		@BodyParam('id', {description: 'Podcast ID to remove', isID: true})
			id: string
	): Promise<void> {
		const podcast = await this.orm.Podcast.oneOrFail(id);
		await this.podcastService.remove(podcast);
	}

}

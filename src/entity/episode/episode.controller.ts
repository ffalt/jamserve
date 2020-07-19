import {Episode, EpisodePage, EpisodeUpdateStatus} from './episode.model';
import {User} from '../user/user';
import {BodyParam, Controller, CurrentUser, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {IncludesPodcastArgs} from '../podcast/podcast.args';
import {EpisodeFilterArgs, EpisodeOrderArgs, IncludesEpisodeArgs, IncludesEpisodeParentArgs} from './episode.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {Inject} from 'typescript-ioc';
import {EpisodeService} from './episode.service';
import {logger} from '../../utils/logger';

const log = logger('EpisodeController');

@Controller('/episode', {tags: ['Episode'], roles: [UserRole.stream]})
export class EpisodeController extends BaseController {
	@Inject
	episodeService!: EpisodeService;

	@Get(
		'/id',
		() => Episode,
		{description: 'Get a Episode by Id', summary: 'Get Episode'}
	)
	async id(
		@QueryParam('id', {description: 'Episode Id', isID: true}) id: string,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() episodeParentArgs: IncludesEpisodeParentArgs,
		@QueryParams() podcastArgs: IncludesPodcastArgs,
		@CurrentUser() user: User
	): Promise<Episode> {
		return this.transform.episode(
			await this.orm.Episode.oneOrFail(id),
			episodeArgs, episodeParentArgs, podcastArgs, user
		);
	}

	@Get(
		'/search',
		() => EpisodePage,
		{description: 'Search Episodes'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() episodeParentArgs: IncludesEpisodeParentArgs,
		@QueryParams() podcastArgs: IncludesPodcastArgs,
		@QueryParams() filter: EpisodeFilterArgs,
		@QueryParams() order: EpisodeOrderArgs,
		@QueryParams() list: ListArgs,
		@CurrentUser() user: User
	): Promise<EpisodePage> {
		if (list.list) {
			return await this.orm.Episode.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.episode(o, episodeArgs, episodeParentArgs, podcastArgs, user)
			);
		}
		return await this.orm.Episode.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.episode(o, episodeArgs, episodeParentArgs, podcastArgs, user)
		);
	}

	@Get(
		'/status',
		() => EpisodeUpdateStatus,
		{description: 'Get a Episode Status by Id', summary: 'Get Status'}
	)
	async status(@QueryParam('id', {description: 'Episode Id', isID: true}) id: string): Promise<EpisodeUpdateStatus> {
		return this.transform.episodeStatus(await this.orm.Episode.oneOrFail(id));
	}


	@Post(
		'/retrieve',
		{description: 'Retrieve a Podcast Episode Media File', roles: [UserRole.podcast], summary: 'Retrieve Episode'}
	)
	async retrieve(
		@BodyParam('id', {description: 'Episode Id', isID: true}) id: string,
		@CurrentUser() user: User
	): Promise<void> {
		const episode = await this.orm.Episode.oneOrFail(id);
		if (!episode.path) {
			this.episodeService.downloadEpisode(episode).catch(e => log.error(e)); // do not wait
		}
	}

}

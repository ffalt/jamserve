import {Episode, EpisodePage, EpisodeUpdateStatus} from './episode.model.js';
import {BodyParam, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest/index.js';
import {UserRole} from '../../types/enums.js';
import {IncludesPodcastArgs} from '../podcast/podcast.args.js';
import {EpisodeFilterArgs, EpisodeOrderArgs, IncludesEpisodeArgs, IncludesEpisodeParentArgs} from './episode.args.js';
import {ListArgs, PageArgs} from '../base/base.args.js';
import {logger} from '../../utils/logger.js';
import {Context} from '../../modules/engine/rest/context.js';

const log = logger('EpisodeController');

@Controller('/episode', {tags: ['Episode'], roles: [UserRole.stream]})
export class EpisodeController {
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
		@Ctx() {orm, engine, user}: Context
	): Promise<Episode> {
		return engine.transform.episode(
			orm, await orm.Episode.oneOrFailByID(id),
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
		@Ctx() {orm, engine, user}: Context
	): Promise<EpisodePage> {
		if (list.list) {
			return await orm.Episode.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.episode(orm, o, episodeArgs, episodeParentArgs, podcastArgs, user)
			);
		}
		return await orm.Episode.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.episode(orm, o, episodeArgs, episodeParentArgs, podcastArgs, user)
		);
	}

	@Get(
		'/status',
		() => EpisodeUpdateStatus,
		{description: 'Get a Episode Status by Id', summary: 'Get Status'}
	)
	async status(
		@QueryParam('id', {description: 'Episode Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<EpisodeUpdateStatus> {
		return engine.transform.Episode.episodeStatus(await orm.Episode.oneOrFailByID(id));
	}


	@Post(
		'/retrieve',
		{description: 'Retrieve a Podcast Episode Media File', roles: [UserRole.podcast], summary: 'Retrieve Episode'}
	)
	async retrieve(
		@BodyParam('id', {description: 'Episode Id', isID: true}) id: string,
		@Ctx() {orm, engine}: Context
	): Promise<void> {
		const episode = await orm.Episode.oneOrFailByID(id);
		if (!episode.path) {
			engine.episode.downloadEpisode(orm, episode).catch(e => log.error(e)); // do not wait
		}
	}

}

import { Episode, EpisodePage, EpisodeUpdateStatus } from './episode.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesPodcastParameters } from '../podcast/podcast.parameters.js';
import { EpisodeFilterParameters, EpisodeOrderParameters, IncludesEpisodeParameters, IncludesEpisodeParentParameters } from './episode.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { logger } from '../../utils/logger.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

const log = logger('EpisodeController');

@Controller('/episode', { tags: ['Episode'], roles: [UserRole.stream] })
export class EpisodeController {
	@Get(
		'/id',
		() => Episode,
		{ description: 'Get a Episode by Id', summary: 'Get Episode' }
	)
	async id(
		@QueryParameter('id', { description: 'Episode Id', isID: true }) id: string,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@QueryParameters() episodeParentParameters: IncludesEpisodeParentParameters,
		@QueryParameters() podcastParameters: IncludesPodcastParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Episode> {
		return engine.transform.episode(
			orm, await orm.Episode.oneOrFailByID(id),
			episodeParameters, episodeParentParameters, podcastParameters, user
		);
	}

	@Get(
		'/search',
		() => EpisodePage,
		{ description: 'Search Episodes' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@QueryParameters() episodeParentParameters: IncludesEpisodeParentParameters,
		@QueryParameters() podcastParameters: IncludesPodcastParameters,
		@QueryParameters() filter: EpisodeFilterParameters,
		@QueryParameters() order: EpisodeOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<EpisodePage> {
		if (list.list) {
			return await orm.Episode.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.episode(orm, o, episodeParameters, episodeParentParameters, podcastParameters, user)
			);
		}
		return await orm.Episode.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.episode(orm, o, episodeParameters, episodeParentParameters, podcastParameters, user)
		);
	}

	@Get(
		'/status',
		() => EpisodeUpdateStatus,
		{ description: 'Get a Episode Status by Id', summary: 'Get Status' }
	)
	async status(
		@QueryParameter('id', { description: 'Episode Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<EpisodeUpdateStatus> {
		return engine.transform.Episode.episodeStatus(await orm.Episode.oneOrFailByID(id));
	}

	@Post(
		'/retrieve',
		{ description: 'Retrieve a Podcast Episode Media File', roles: [UserRole.podcast], summary: 'Retrieve Episode' }
	)
	async retrieve(
		@BodyParameter('id', { description: 'Episode Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<void> {
		const episode = await orm.Episode.oneOrFailByID(id);
		if (!episode.path) {
			engine.episode.downloadEpisode(orm, episode)
				.catch((error: unknown) => {
					log.error(error);
				}); // do not wait
		}
	}
}

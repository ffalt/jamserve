import { PlayQueue } from './playqueue.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { IncludesPlayQueueParameters, PlayQueueSetParameters } from './playqueue.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';

@Controller('/playqueue', { tags: ['PlayQueue'], roles: [UserRole.stream] })
export class PlayQueueController {
	@Get('/get',
		() => PlayQueue,
		{ description: 'Get a PlayQueue for the calling user', summary: 'Get PlayQueue' }
	)
	async get(
		@QueryParameters() queueParameters: IncludesPlayQueueParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<PlayQueue> {
		return engine.transform.playQueue(
			orm, await engine.playQueue.get(orm, user),
			queueParameters, trackParameters, episodeParameters, user
		);
	}

	@Post('/set',
		{ description: 'Create/update the PlayQueue for the calling user', summary: 'Set PlayQueue' }
	)
	async set(
		@BodyParameters() parameters: PlayQueueSetParameters,
		@RestContext() { req, engine, orm, user }: Context
	): Promise<void> {
		await engine.playQueue.set(orm, parameters, user, req.session.client ?? 'unknown');
	}

	@Post('/clear',
		{ description: 'Clear the PlayQueue for the calling user', summary: 'Clear PlayQueue' }
	)
	async clear(
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		await engine.playQueue.clear(orm, user);
	}
}

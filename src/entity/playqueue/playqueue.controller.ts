import { PlayQueue } from './playqueue.model.js';
import { BodyParams, Controller, Ctx, Get, Post, QueryParams } from '../../modules/rest/index.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackArgs } from '../track/track.args.js';
import { IncludesPlayQueueArgs, PlayQueueSetArgs } from './playqueue.args.js';
import { IncludesEpisodeArgs } from '../episode/episode.args.js';
import { Context } from '../../modules/engine/rest/context.js';
@Controller('/playqueue', { tags: ['PlayQueue'], roles: [UserRole.stream] })
export class PlayQueueController {
	@Get('/get',
		() => PlayQueue,
		{ description: 'Get a PlayQueue for the calling user', summary: 'Get PlayQueue' }
	)
	async get(
		@QueryParams() playqueueArgs: IncludesPlayQueueArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<PlayQueue> {
		return engine.transform.playQueue(
			orm, await engine.playQueue.get(orm, user),
			playqueueArgs, trackArgs, episodeArgs, user
		);
	}

	@Post('/set',
		{ description: 'Create/update the PlayQueue for the calling user', summary: 'Set PlayQueue' }
	)
	async set(
		@BodyParams() args: PlayQueueSetArgs,
		@Ctx() { req, engine, orm, user }: Context
	): Promise<void> {
		await engine.playQueue.set(orm, args, user, req.session?.client || 'unknown');
	}

	@Post('/clear',
		{ description: 'Clear the PlayQueue for the calling user', summary: 'Clear PlayQueue' }
	)
	async clear(
		@Ctx() { orm, engine, user }: Context
	): Promise<void> {
		await engine.playQueue.clear(orm, user);
	}
}

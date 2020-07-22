import {PlayQueue} from './playqueue.model';
import {InRequestScope, Inject} from 'typescript-ioc';
import {TransformService} from '../../modules/engine/services/transform.service';
import {BodyParams, Controller, Ctx, Get, Post, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {IncludesTrackArgs} from '../track/track.args';
import {IncludesPlayQueueArgs, PlayQueueSetArgs} from './playqueue.args';
import {IncludesEpisodeArgs} from '../episode/episode.args';
import {PlayQueueService} from './playqueue.service';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
@Controller('/playqueue', {tags: ['PlayQueue'], roles: [UserRole.stream]})
export class PlayQueueController {
	@Inject
	private transform!: TransformService;
	@Inject
	private playQueueService!: PlayQueueService;

	@Get('/get',
		() => PlayQueue,
		{description: 'Get a PlayQueue for the calling user', summary: 'Get PlayQueue'}
	)
	async get(
		@QueryParams() playqueueArgs: IncludesPlayQueueArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() {orm, user}: Context
	): Promise<PlayQueue> {

		return this.transform.playQueue(
			orm, await this.playQueueService.get(orm, user),
			playqueueArgs, trackArgs, episodeArgs, user
		);
	}

	@Post('/set',
		{description: 'Create/update the PlayQueue for the calling user', summary: 'Set PlayQueue'}
	)
	async set(
		@BodyParams() args: PlayQueueSetArgs,
		@Ctx() {req, orm, user}: Context
	): Promise<void> {
		await this.playQueueService.set(orm, args, user, req.session?.client || 'unknown');
	}

	@Post('/clear',
		{description: 'Clear the PlayQueue for the calling user', summary: 'Clear PlayQueue'}
	)
	async clear(
		@Ctx() {orm, user}: Context
	): Promise<void> {
		await this.playQueueService.clear(orm, user);
	}
}

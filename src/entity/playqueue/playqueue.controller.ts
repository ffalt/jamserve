import {PlayQueue} from './playqueue.model';
import {OrmService} from '../../modules/engine/services/orm.service';
import {Inject} from 'typescript-ioc';
import {User} from '../user/user';
import {TransformService} from '../../modules/engine/services/transform.service';
import {Controller, Ctx, CurrentUser, Get, Post, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {IncludesTrackArgs} from '../track/track.args';
import {IncludesPlayQueueArgs, PlayQueueSetArgs} from './playqueue.args';
import {IncludesEpisodeArgs} from '../episode/episode.args';
import {PlayQueueService} from './playqueue.service';
import {Context} from '../../modules/server/middlewares/rest.context';
import {BodyParams} from '../../modules/rest/decorators/BodyParams';

@Controller('/playqueue', {tags: ['PlayQueue'], roles: [UserRole.stream]})
export class PlayQueueController {
	@Inject
	private orm!: OrmService;
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
		@CurrentUser() user: User
	): Promise<PlayQueue> {

		return this.transform.playQueue(
			await this.playQueueService.get(user),
			playqueueArgs, trackArgs, episodeArgs, user
		);
	}

	@Post('/set',
		{description: 'Create/update the PlayQueue for the calling user', summary: 'Set PlayQueue'}
	)
	async set(
		@BodyParams() args: PlayQueueSetArgs,
		@Ctx() {req, user}: Context
	): Promise<void> {
		await this.playQueueService.set(args, user, req.session?.client || 'unknown');
	}

	@Post('/clear',
		{description: 'Clear the PlayQueue for the calling user', summary: 'Clear PlayQueue'}
	)
	async clear(
		@CurrentUser() user: User
	): Promise<void> {
		await this.playQueueService.clear(user);
	}
}

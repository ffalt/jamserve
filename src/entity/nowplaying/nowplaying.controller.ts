import {Inject} from 'typescript-ioc';
import {TransformService} from '../../modules/engine/services/transform.service';
import {BodyParam, Controller, CurrentUser, Get, Post, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {NowPlayingService} from './nowplaying.service';
import {NowPlaying} from './nowplaying.model';
import {User} from '../user/user';
import {IncludesNowPlayingArgs} from './nowplaying.args';
import {IncludesTrackArgs} from '../track/track.args';
import {IncludesEpisodeArgs} from '../episode/episode.args';
import {OrmService} from '../../modules/engine/services/orm.service';

@Controller('/nowPlaying', {tags: ['Now Playing'], roles: [UserRole.stream]})
export class NowPlayingController {
	@Inject
	private transform!: TransformService;
	@Inject
	private nowPlayingService!: NowPlayingService;
	@Inject
	private orm!: OrmService;

	@Get(
		'/list',
		() => [NowPlaying],
		{description: 'Get a List of media [Track, Episode] played currently by Users', summary: 'Get Now Playing'}
	)
	async list(
		@QueryParams() nowPlayingArgs: IncludesNowPlayingArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@CurrentUser() user: User
	): Promise<Array<NowPlaying>> {
		const result = await this.nowPlayingService.getNowPlaying();
		return await Promise.all(result.map(o =>
			this.transform.nowPlaying(o, nowPlayingArgs, trackArgs, episodeArgs, user))
		);
	}

	@Post('/scrobble', {description: 'Report playing (scrobble) a media file [Track, Episode]', summary: 'Scrobble'})
	async scrobble(
		@BodyParam('id', {description: 'Media Id', isID: true}) id: string,
		@CurrentUser() user: User
	): Promise<void> {
		await this.nowPlayingService.scrobble(id, user);
	}

}
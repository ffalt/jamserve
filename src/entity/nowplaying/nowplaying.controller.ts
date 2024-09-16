import {BodyParam, Controller, Ctx, Get, Post, QueryParams} from '../../modules/rest/index.js';
import {UserRole} from '../../types/enums.js';
import {NowPlaying} from './nowplaying.model.js';
import {IncludesNowPlayingArgs} from './nowplaying.args.js';
import {IncludesTrackArgs} from '../track/track.args.js';
import {IncludesEpisodeArgs} from '../episode/episode.args.js';
import {Context} from '../../modules/engine/rest/context.js';
@Controller('/nowPlaying', {tags: ['Now Playing'], roles: [UserRole.stream]})
export class NowPlayingController {

	@Get(
		'/list',
		() => [NowPlaying],
		{description: 'Get a List of media [Track, Episode] played currently by Users', summary: 'Get Now Playing'}
	)
	async list(
		@QueryParams() nowPlayingArgs: IncludesNowPlayingArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Array<NowPlaying>> {
		const result = await engine.nowPlaying.getNowPlaying();
		return await Promise.all(result.map(o =>
			engine.transform.nowPlaying(orm, o, nowPlayingArgs, trackArgs, episodeArgs, user))
		);
	}

	@Post('/scrobble', {description: 'Report playing (scrobble) a media file [Track, Episode]', summary: 'Scrobble'})
	async scrobble(
		@BodyParam('id', {description: 'Media Id', isID: true}) id: string,
		@Ctx() {orm, engine, user}: Context
	): Promise<void> {
		await engine.nowPlaying.scrobble(orm, id, user);
	}

}

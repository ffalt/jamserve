import { UserRole } from '../../types/enums.js';
import { NowPlaying } from './nowplaying.model.js';
import { IncludesNowPlayingParameters } from './nowplaying.parameters.js';
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

@Controller('/nowPlaying', { tags: ['Now Playing'], roles: [UserRole.stream] })
export class NowPlayingController {
	@Get(
		'/list',
		() => [NowPlaying],
		{ description: 'Get a List of media [Track, Episode] played currently by Users', summary: 'Get Now Playing' }
	)
	async list(
		@QueryParameters() nowPlayingParameters: IncludesNowPlayingParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Array<NowPlaying>> {
		const result = await engine.nowPlaying.getNowPlaying();
		return await Promise.all(result.map(o =>
			engine.transform.nowPlaying(orm, o, nowPlayingParameters, trackParameters, episodeParameters, user))
		);
	}

	@Post('/scrobble', { description: 'Report playing (scrobble) a media file [Track, Episode]', summary: 'Scrobble' })
	async scrobble(
		@BodyParameter('id', { description: 'Media Id', isID: true }) id: string,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		await engine.nowPlaying.scrobble(orm, id, user);
	}
}

import { Episode } from '../episode/episode.js';
import { Track } from '../track/track.js';
import { User } from '../user/user.js';
import { NowPlaying } from './nowplaying.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { DBObjectType } from '../../types/enums.js';
import { logger } from '../../utils/logger.js';
import { StateService } from '../state/state.service.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';

const log = logger('NowPlayingService');

@InRequestScope
export class NowPlayingService {
	private playing: Array<NowPlaying> = [];
	@Inject
	private readonly stateService!: StateService;

	async getNowPlaying(): Promise<Array<NowPlaying>> {
		return this.playing;
	}

	clear(): void {
		this.playing = [];
	}

	async report(orm: Orm, entries: Array<{ id?: string; type: DBObjectType }>, user: User): Promise<void> {
		await this.stateService.reportPlaying(orm, entries, user);
	}

	async reportEpisode(orm: Orm, episode: Episode, user: User): Promise<NowPlaying> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		const result = { time: Date.now(), episode, user };
		this.playing.push(result);
		this.report(orm, [
			{ id: episode.id, type: DBObjectType.episode },
			{ id: episode.podcast.idOrFail(), type: DBObjectType.podcast }
		], user)
			.catch(error => log.error(error)); // do not wait
		return result;
	}

	async reportTrack(orm: Orm, track: Track, user: User): Promise<NowPlaying> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		const result = { time: Date.now(), track, user };
		this.playing.push(result);
		this.report(orm, [
			{ id: track.id, type: DBObjectType.track },
			{ id: track.album.id(), type: DBObjectType.album },
			{ id: track.artist.id(), type: DBObjectType.artist },
			{ id: track.folder.id(), type: DBObjectType.folder },
			{ id: track.series.id(), type: DBObjectType.series },
			{ id: track.root.id(), type: DBObjectType.root }
		], user)
			.catch(error => log.error(error)); // do not wait
		return result;
	}

	async scrobble(orm: Orm, id: string, user: User): Promise<NowPlaying> {
		const result = await orm.findInStreamTypes(id);
		if (!result) {
			return Promise.reject(notFoundError());
		}
		switch (result.objType) {
			case DBObjectType.track: {
				return await this.reportTrack(orm, result.obj as Track, user);
			}
			case DBObjectType.episode: {
				return this.reportEpisode(orm, result.obj as Episode, user);
			}
			default: {
				return Promise.reject(new Error('Invalid Object Type for Scrobbling'));
			}
		}
	}
}

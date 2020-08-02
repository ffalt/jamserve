import {Episode} from '../episode/episode';
import {Track} from '../track/track';
import {User} from '../user/user';
import {NowPlaying} from './nowplaying';
import {Inject, InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {NotFoundError} from '../../modules/rest/builder';
import {DBObjectType} from '../../types/enums';
import {logger} from '../../utils/logger';
import {StateService} from '../state/state.service';

const log = logger('NowPlayingService');

@InRequestScope
export class NowPlayingService {
	private playing: Array<NowPlaying> = [];
	@Inject
	private stateService!: StateService;

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
		const result = {time: Date.now(), episode, user};
		this.playing.push(result);
		this.report(orm, [
			{id: episode.id, type: DBObjectType.episode},
			{id: episode.podcast.idOrFail(), type: DBObjectType.podcast},
		], user).catch(e => log.error(e)); // do not wait
		return result;
	}

	async reportTrack(orm: Orm, track: Track, user: User): Promise<NowPlaying> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		const result = {time: Date.now(), track, user};
		this.playing.push(result);
		this.report(orm, [
			{id: track.id, type: DBObjectType.track},
			{id: track.album.id(), type: DBObjectType.album},
			{id: track.artist.id(), type: DBObjectType.artist},
			{id: track.folder.id(), type: DBObjectType.folder},
			{id: track.series.id(), type: DBObjectType.series},
			{id: track.root.id(), type: DBObjectType.root},
		], user).catch(e => log.error(e)); // do not wait
		return result;
	}

	async scrobble(orm: Orm, id: string, user: User): Promise<NowPlaying> {
		const result = await orm.findInStreamTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		switch (result.objType) {
			case DBObjectType.track:
				return await this.reportTrack(orm, result.obj as Track, user);
			case DBObjectType.episode:
				return this.reportEpisode(orm, result.obj as Episode, user);
			default:
				return Promise.reject(Error('Invalid Object Type for Scrobbling'));
		}
	}
}

import {Episode} from '../episode/episode';
import {Track} from '../track/track';
import {User} from '../user/user';
import {NowPlaying} from './nowplaying';
import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {NotFoundError} from '../../modules/rest/builder';
import {DBObjectType} from '../../types/enums';
import {logger} from '../../utils/logger';
import {StateService} from '../state/state.service';

const log = logger('NowPlayingService');

@Singleton
export class NowPlayingService {
	private playing: Array<NowPlaying> = [];
	@Inject
	private orm!: OrmService;
	@Inject
	private stateService!: StateService;

	async getNowPlaying(): Promise<Array<NowPlaying>> {
		return this.playing;
	}

	clear(): void {
		this.playing = [];
	}

	async report(entries: Array<{ userID: string; id?: string; type: DBObjectType }>): Promise<void> {
		// await this.stateService.reportPlaying(episode.id, DBObjectType.episode, user.id);
		// await this.stateService.reportPlaying(episode.podcastID, DBObjectType.podcast, user.id);
	}

	async reportEpisode(episode: Episode, user: User): Promise<NowPlaying> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		const result = {time: Date.now(), episode, user};
		this.playing.push(result);
		this.report([
			{id: episode.id, type: DBObjectType.episode, userID: user.id},
			{id: episode.podcast.id, type: DBObjectType.podcast, userID: user.id},
		]).catch(e => log.error(e)); // do not wait
		return result;
	}

	async reportTrack(track: Track, user: User): Promise<NowPlaying> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		const result = {time: Date.now(), track, user};
		this.playing.push(result);
		this.report([
			{id: track.id, type: DBObjectType.track, userID: user.id},
			{id: track.album?.id, type: DBObjectType.album, userID: user.id},
			{id: track.artist?.id, type: DBObjectType.artist, userID: user.id},
			{id: track.folder?.id, type: DBObjectType.folder, userID: user.id},
			{id: track.series?.id, type: DBObjectType.series, userID: user.id},
			{id: track.root?.id, type: DBObjectType.root, userID: user.id},
		]).catch(e => log.error(e)); // do not wait
		return result;
	}

	async scrobble(id: string, user: User): Promise<NowPlaying> {
		const result = await this.orm.findInStreamTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		switch (result.objType) {
			case DBObjectType.track:
				return await this.reportTrack(result.obj as Track, user);
			case DBObjectType.episode:
				return this.reportEpisode(result.obj as Episode, user)
			default:
				return Promise.reject(Error('Invalid Object Type for Scrobbling'));
		}
	}
}

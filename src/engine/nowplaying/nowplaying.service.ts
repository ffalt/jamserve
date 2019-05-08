import {DBObjectType} from '../../db/db.types';
import {Episode} from '../episode/episode.model';
import {StateService} from '../state/state.service';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';
import {NowPlaying} from './nowplaying.model';

export class NowPlayingService {
	playing: Array<NowPlaying> = [];

	constructor(private stateService: StateService) {
	}

	async getNowPlaying(): Promise<Array<NowPlaying>> {
		return this.playing;
	}

	clear(): void {
		this.playing = [];
	}

	async reportEpisode(episode: Episode, user: User): Promise<void> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		this.playing.push({
			time: Date.now(),
			obj: episode,
			user
		});
		await this.stateService.reportPlaying(episode.id, DBObjectType.episode, user.id);
		await this.stateService.reportPlaying(episode.podcastID, DBObjectType.podcast, user.id);
	}

	async reportTrack(track: Track, user: User): Promise<void> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		this.playing.push({
			time: Date.now(),
			obj: track,
			user
		});
		await this.stateService.reportPlaying(track.id, DBObjectType.track, user.id);
		await this.stateService.reportPlaying(track.albumID, DBObjectType.album, user.id);
		await this.stateService.reportPlaying(track.artistID, DBObjectType.artist, user.id);
		await this.stateService.reportPlaying(track.parentID, DBObjectType.folder, user.id);
	}
}

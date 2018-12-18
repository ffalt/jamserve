import {DBObjectType} from '../../types';
import {NowPlaying} from './nowplaying.model';
import {User} from '../../objects/user/user.model';
import {Episode} from '../../objects/episode/episode.model';
import {Track} from '../../objects/track/track.model';
import {StateService} from '../../objects/state/state.service';

export class NowPlayingService {
	playing: Array<NowPlaying> = [];

	constructor(private stateService: StateService) {
	}

	async getNowPlaying(): Promise<Array<NowPlaying>> {
		return this.playing;
	}

	clear() {
		this.playing = [];
	}

	async reportEpisode(episode: Episode, user: User): Promise<void> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		this.playing.push({
			time: Date.now(),
			obj: episode,
			user: user
		});
		await this.stateService.reportPlaying(episode.id, DBObjectType.episode, user.id);
		await this.stateService.reportPlaying(episode.podcastID, DBObjectType.podcast, user.id);
	}

	async reportTrack(track: Track, user: User): Promise<void> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		this.playing.push({
			time: (new Date()).valueOf(),
			obj: track,
			user: user
		});
		await this.stateService.reportPlaying(track.id, DBObjectType.track, user.id);
		await this.stateService.reportPlaying(track.albumID, DBObjectType.album, user.id);
		await this.stateService.reportPlaying(track.artistID, DBObjectType.artist, user.id);
		await this.stateService.reportPlaying(track.parentID, DBObjectType.folder, user.id);
	}
}

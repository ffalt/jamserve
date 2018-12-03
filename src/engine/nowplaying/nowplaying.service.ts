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

	async reportPlaying(id: string, type: DBObjectType, user: User): Promise<void> {
		const state = await this.stateService.findOrCreate(id, user.id, type);
		state.played++;
		state.lastplayed = (new Date()).valueOf();
		await this.stateService.upsert([state]);
	}

	async reportEpisode(episode: Episode, user: User): Promise<void> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		this.playing.push({
			time: (new Date()).valueOf(),
			obj: episode,
			user: user
		});
		await this.reportPlaying(episode.id, DBObjectType.episode, user);
	}

	async reportTrack(track: Track, user: User): Promise<void> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		this.playing.push({
			time: (new Date()).valueOf(),
			obj: track,
			user: user
		});
		await this.reportPlaying(track.id, DBObjectType.track, user);
		await this.reportPlaying(track.albumID, DBObjectType.album, user);
		await this.reportPlaying(track.artistID, DBObjectType.artist, user);
		await this.reportPlaying(track.parentID, DBObjectType.folder, user);
	}
}

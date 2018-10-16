import {JamServe} from '../../model/jamserve';
import {Store} from '../../store/store';
import {DBObjectType} from '../../types';

export class NowPlaying {
	private readonly store: Store;
	playing: Array<JamServe.NowPlaying> = [];

	constructor(store: Store) {
		this.store = store;
	}

	async getNowPlaying(): Promise<Array<JamServe.NowPlaying>> {
		return this.playing;
	}

	async reportPlaying(id: string, type: DBObjectType, user: JamServe.User): Promise<void> {
		const state = await this.store.state.findOrCreate(id, user.id, type);
		state.played++;
		state.lastplayed = (new Date()).valueOf();
		await this.store.state.upsert([state]);
	}

	async reportEpisode(episode: JamServe.Episode, user: JamServe.User): Promise<void> {
		this.playing = this.playing.filter(np => (np.user.id !== user.id));
		this.playing.push({
			time: (new Date()).valueOf(),
			obj: episode,
			user: user
		});
		await this.reportPlaying(episode.id, DBObjectType.episode, user);
	}

	async reportTrack(track: JamServe.Track, user: JamServe.User): Promise<void> {
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

import {JamServe} from '../../model/jamserve';
import {Store} from '../../store/store';
import {DBObjectType} from '../../types';

export async function updatePlayListTracks(store: Store, playlist: JamServe.Playlist): Promise<void> {
	const tracks = await store.track.byIds(playlist.trackIDs);
	const trackHash: { [id: string]: JamServe.Track } = {};
	tracks.forEach(track => {
		trackHash[track.id] = track;
	});
	playlist.trackIDs = playlist.trackIDs.filter(id => !!trackHash[id]);
	playlist.duration = 0;
	playlist.trackIDs.forEach(id => {
		const track = trackHash[id];
		playlist.duration += (track.media.duration || 0);
	});
}

export class Playlists {
	private readonly store: Store;

	constructor(store: Store) {
		this.store = store;
	}

	async createPlaylist(name: string, comment: string | undefined, isPublic: boolean, userID: string, trackIDs: Array<string>): Promise<JamServe.Playlist> {
		const now = Date.now();
		const playlist: JamServe.Playlist = {
			id: '',
			type: DBObjectType.playlist,
			name: name,
			comment: comment,
			isPublic: isPublic,
			userID: userID,
			created: now,
			changed: now,
			trackIDs: trackIDs,
			duration: 0
		};
		await updatePlayListTracks(this.store, playlist);
		playlist.id = await this.store.playlist.add(playlist);
		return playlist;
	}

	async updatePlaylist(playlist: JamServe.Playlist): Promise<void> {
		await updatePlayListTracks(this.store, playlist);
		await this.store.playlist.replace(playlist);
	}

	async removePlaylist(playlist: JamServe.Playlist): Promise<void> {
		return this.store.playlist.remove(playlist.id);
	}
}

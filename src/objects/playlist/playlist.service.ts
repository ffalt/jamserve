import {DBObjectType} from '../../types';
import {Playlist} from './playlist.model';
import {Track} from '../track/track.model';
import {PlaylistStore} from './playlist.store';
import {TrackStore} from '../track/track.store';

export async function updatePlayListTracks(trackStore: TrackStore, playlist: Playlist): Promise<void> {
	const tracks = await trackStore.byIds(playlist.trackIDs);
	const trackHash: { [id: string]: Track } = {};
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

export class PlaylistService {

	constructor(private playlistStore: PlaylistStore, private trackStore: TrackStore) {
	}

	async createPlaylist(name: string, comment: string | undefined, isPublic: boolean, userID: string, trackIDs: Array<string>): Promise<Playlist> {
		const now = Date.now();
		const playlist: Playlist = {
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
		await updatePlayListTracks(this.trackStore, playlist);
		playlist.id = await this.playlistStore.add(playlist);
		return playlist;
	}

	async updatePlaylist(playlist: Playlist): Promise<void> {
		await updatePlayListTracks(this.trackStore, playlist);
		await this.playlistStore.replace(playlist);
	}

	async removePlaylist(playlist: Playlist): Promise<void> {
		return this.playlistStore.remove(playlist.id);
	}
}

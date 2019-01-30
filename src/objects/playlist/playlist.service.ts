import {DBObjectType} from '../../db/db.types';
import {Playlist} from './playlist.model';
import {Track} from '../track/track.model';
import {PlaylistStore, SearchQueryPlaylist} from './playlist.store';
import {TrackStore} from '../track/track.store';
import {BaseStoreService} from '../base/base.service';

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

export class PlaylistService extends BaseStoreService<Playlist, SearchQueryPlaylist> {

	constructor(public playlistStore: PlaylistStore, private trackStore: TrackStore) {
		super(playlistStore);
	}

	async create(name: string, comment: string | undefined, isPublic: boolean, userID: string, trackIDs: Array<string>): Promise<Playlist> {
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

	async update(playlist: Playlist): Promise<void> {
		await updatePlayListTracks(this.trackStore, playlist);
		await this.playlistStore.replace(playlist);
	}

	async remove(playlist: Playlist): Promise<void> {
		return this.playlistStore.remove(playlist.id);
	}
}

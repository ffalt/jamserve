import {JamParameters} from '../../model/jam-rest-params-0.1.0';
import {Jam} from '../../model/jam-rest-data-0.1.0';
import {Playlist} from './playlist.model';

export function formatPlaylist(playlist: Playlist, includes: JamParameters.IncludesPlaylist): Jam.Playlist {
	return {
		id: playlist.id,
		name: playlist.name,
		userID: playlist.userID,
		comment: playlist.comment,
		isPublic: playlist.isPublic,
		duration: playlist.duration,
		created: playlist.created,
		changed: playlist.changed,
		trackCount: playlist.trackIDs.length,
		trackIDs: includes.playlistTracksIDs ? playlist.trackIDs : undefined
	};
}

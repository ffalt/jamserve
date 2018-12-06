import {Playlist} from './playlist.model';
import {DBObjectType} from '../../types';

export function mockPlaylist(): Playlist {
	return {
		id: '',
		type: DBObjectType.playlist,
		name: 'a name',
		userID: 'userID1',
		comment: 'a comment',
		coverArt: 'playlistID1.jpg',
		created: 1543495268,
		changed: 1543495269,
		allowedUser: ['userID1', 'userID2'],
		isPublic: false,
		duration: 12345,
		trackIDs: ['trackID1', 'trackID2']
	};
}

export function mockPlaylist2(): Playlist {
	return {
		id: '',
		type: DBObjectType.playlist,
		name: 'second name',
		userID: 'userID2',
		comment: 'second comment',
		coverArt: 'playlistID2.jpg',
		created: 1543495268,
		changed: 1543495269,
		allowedUser: [],
		isPublic: true,
		duration: 54321,
		trackIDs: ['trackID3', 'trackID4']
	};
}

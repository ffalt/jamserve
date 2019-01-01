import {Artist} from './artist.model';
import {AlbumType, DBObjectType} from '../../model/jam-types';

export function mockArtist(): Artist {
	return {
		id: '',
		type: DBObjectType.artist,
		name: 'artist name',
		rootIDs: ['rootID1', 'rootID2'],
		trackIDs: ['trackID1', 'trackID2'],
		albumTypes: [AlbumType.album, AlbumType.compilation],
		albumIDs: ['albumID1', 'albumID2'],
		mbArtistID: 'mbArtistID1',
		created: 1543495268
	};
}

export function mockArtist2(): Artist {
	return {
		id: '',
		type: DBObjectType.artist,
		name: 'second artist name',
		albumTypes: [AlbumType.compilation],
		rootIDs: ['rootID2'],
		trackIDs: ['trackID3', 'trackID4'],
		albumIDs: ['albumID3', 'albumID4'],
		mbArtistID: 'mbArtistID2',
		created: 1443495268
	};
}

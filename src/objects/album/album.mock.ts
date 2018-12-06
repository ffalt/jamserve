import {Album} from './album.model';
import {DBObjectType} from '../../types';

export function mockAlbum(): Album {
	return {
		id: '',
		type: DBObjectType.album,
		name: 'album name',
		rootIDs: ['rootID1', 'rootID2'],
		trackIDs: ['trackID1', 'trackID2'],
		artistID: 'artistID1',
		artist: 'artist name',
		genre: 'genre name',
		year: 1984,
		duration: 12345,
		created: 1543495268,
		mbArtistID: 'mbArtistID',
		mbAlbumID: 'mbAlbumID'
	};
}

export function mockAlbum2(): Album {
	return {
		id: '',
		type: DBObjectType.album,
		name: 'second album name',
		rootIDs: ['rootID2', 'rootID3'],
		trackIDs: ['trackID3', 'trackID4'],
		artistID: 'artistID2',
		artist: 'second artist name',
		genre: 'second genre name',
		year: 2000,
		duration: 54321,
		created: 1443495268,
		mbArtistID: 'mbArtistID2',
		mbAlbumID: 'mbAlbumID2'
	};
}

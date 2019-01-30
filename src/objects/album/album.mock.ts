import {Album} from './album.model';
import {AlbumType} from '../../model/jam-types';
import {DBObjectType} from '../../db/db.types';

export function mockAlbum(): Album {
	return {
		id: '',
		type: DBObjectType.album,
		albumType: AlbumType.album,
		name: 'album name',
		slug: 'albumname',
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
		albumType: AlbumType.compilation,
		name: 'second album name',
		slug: 'secondalbumname',
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

export function generateMockObjects(): Array<Album> {
	return [mockAlbum(), mockAlbum2()];
}

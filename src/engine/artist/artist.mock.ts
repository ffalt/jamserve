import {DBObjectType} from '../../db/db.types';
import {AlbumType} from '../../model/jam-types';
import {Artist} from './artist.model';

export function mockArtist(): Artist {
	return {
		id: '',
		type: DBObjectType.artist,
		name: 'artist name',
		slug: 'artistname',
		rootIDs: ['rootID1', 'rootID2'],
		trackIDs: ['trackID1', 'trackID2'],
		folderIDs: ['folderID1', 'folderID2'],
		genres: ['a genre name'],
		seriesIDs: [],
		albumTypes: [AlbumType.album, AlbumType.audiobook],
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
		slug: 'secondartistname',
		albumTypes: [AlbumType.compilation],
		rootIDs: ['rootID2'],
		genres: ['another genre name'],
		trackIDs: ['trackID3', 'trackID4'],
		folderIDs: ['folderID3', 'folderID4'],
		seriesIDs: [],
		albumIDs: ['albumID3', 'albumID4'],
		mbArtistID: 'mbArtistID2',
		created: 1443495268
	};
}

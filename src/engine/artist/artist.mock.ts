import {Artist} from './artist.model';
import {AlbumType} from '../../model/jam-types';
import {DBObjectType} from '../../db/db.types';

export function mockArtist(): Artist {
	return {
		id: '',
		type: DBObjectType.artist,
		name: 'artist name',
		slug: 'artistname',
		rootIDs: ['rootID1', 'rootID2'],
		trackIDs: ['trackID1', 'trackID2'],
		folderIDs: ['folderID1', 'folderID2'],
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
		trackIDs: ['trackID3', 'trackID4'],
		folderIDs: ['folderID3', 'folderID4'],
		albumIDs: ['albumID3', 'albumID4'],
		mbArtistID: 'mbArtistID2',
		created: 1443495268
	};
}

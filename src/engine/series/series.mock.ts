import {DBObjectType} from '../../db/db.types';
import {AlbumType} from '../../model/jam-types';
import {Series} from './series.model';

export function mockSeries(): Series {
	return {
		id: '',
		type: DBObjectType.series,
		name: 'artist name',
		artistID: 'artistID1',
		rootIDs: ['rootID1', 'rootID2'],
		folderIDs: ['folderID1', 'folderID2'],
		trackIDs: ['trackID1', 'trackID2'],
		albumTypes: [AlbumType.album, AlbumType.audiobook],
		albumIDs: ['albumID1', 'albumID2'],
		created: 1543495268
	};
}

export function mockSeries2(): Series {
	return {
		id: '',
		type: DBObjectType.series,
		name: 'second artist name',
		artistID: 'artistID2',
		albumTypes: [AlbumType.compilation],
		rootIDs: ['rootID2'],
		trackIDs: ['trackID3', 'trackID4'],
		folderIDs: ['folderID3', 'folderID4'],
		albumIDs: ['albumID3', 'albumID4'],
		created: 1443495268
	};
}

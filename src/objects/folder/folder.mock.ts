import {Folder} from './folder.model';
import {AlbumType, DBObjectType, FolderType} from '../../model/jam-types';
import {mockPath} from '../../utils/testutils.spec';

export function mockFolder(): Folder {
	return {
		id: '',
		type: DBObjectType.folder,
		rootID: 'rootID1',
		path: mockPath('folder name'),
		parentID: 'folderID2',
		stat: {
			created: 1543495268,
			modified: 1543495269
		},
		tag: {
			tracks: 10,
			level: 1,
			type: FolderType.artist,
			genre: 'a genre',
			album: 'an album name',
			artist: 'an artist name',
			artistSort: 'artist sort name, an',
			albumType: AlbumType.unknown,
			title: 'a title',
			image: 'folder.jpg',
			year: 1984,
			mbAlbumID: 'mbAlbumID1',
			mbArtistID: 'mbArtistID1'
		}
	};
}

export function mockFolder2(): Folder {
	return {
		id: '',
		type: DBObjectType.folder,
		rootID: 'rootID2',
		path: mockPath('second folder name'),
		parentID: 'folderID3',
		stat: {
			created: 1443495268,
			modified: 1443495269
		},
		tag: {
			tracks: 2,
			level: 2,
			type: FolderType.album,
			genre: 'second genre',
			album: 'second album name',
			artist: 'second artist name',
			artistSort: 'artist sort name, second',
			albumType: AlbumType.album,
			title: 'second title',
			image: 'second folder.jpg',
			year: 2000,
			mbAlbumID: 'mbAlbumID2',
			mbArtistID: 'mbArtistID2'
		}
	};
}

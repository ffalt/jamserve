import fse from 'fs-extra';
import path from 'path';
import {DBObjectType} from '../../db/db.types';
import {AlbumType, ArtworkImageType, FolderType} from '../../model/jam-types';
import {mockImage} from '../../modules/image/image.module.spec';
import {mockPath} from '../../utils/testutils.spec';
import {Folder} from './folder.model';

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
			trackCount: 10,
			folderCount: 10,
			level: 1,
			type: FolderType.artist,
			genres: ['a genre'],
			album: 'an album name',
			artist: 'an artist name',
			artistSort: 'artist sort name, an',
			albumType: AlbumType.unknown,
			title: 'a title',
			year: 1984,
			mbReleaseID: 'mbReleaseID1',
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
			trackCount: 2,
			folderCount: 0,
			level: 2,
			type: FolderType.album,
			genres: ['second genre'],
			album: 'second album name',
			artist: 'second artist name',
			artistSort: 'artist sort name, second',
			albumType: AlbumType.album,
			title: 'second title',
			year: 2000,
			mbReleaseID: 'mbReleaseID2',
			mbArtistID: 'mbArtistID2'
		}
	};
}

export async function mockFolderArtwork(folder: Folder, type: ArtworkImageType): Promise<string> {
	const name = 'dummy.png';
	const image = await mockImage('png');
	const filename = path.resolve(folder.path, name);
	await fse.writeFile(filename, image.buffer);
	folder.tag.artworks = [{
		id: 'dummyID',
		image: {format: 'png', height: 123, width: 123},
		name,
		types: [type],
		stat: {
			created: 123,
			modified: 123,
			size: 123
		}
	}];
	return filename;
}

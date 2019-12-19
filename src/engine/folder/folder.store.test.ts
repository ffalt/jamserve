import path from 'path';
import {removeTrailingPathSeparator} from '../../utils/fs-utils';
import {mockPath} from '../../utils/testutils.spec';
import {testStore} from '../base/base.store.spec';
import {mockFolder, mockFolder2} from './folder.mock';
import {Folder} from './folder.model';
import {FolderStore, SearchQueryFolder} from './folder.store';

describe('FolderStore', () => {
	let folderStore: FolderStore;

	testStore(testDB => {
			folderStore = new FolderStore(testDB.database);
			return folderStore;
		}, () => {
			return [mockFolder(), mockFolder2()];
		},
		(mock: Folder) => {
			const matches: Array<SearchQueryFolder> = [
				{id: mock.id},
				{ids: [mock.id]},
				{rootID: mock.rootID},
				{parentID: mock.parentID},
				{path: mock.path},
				{inPath: path.dirname(mock.path)},
				{artist: mock.tag.artist},
				{artists: [mock.tag.artist || '']},
				{title: mock.tag.title},
				{album: mock.tag.album},
				...(mock.tag.genres || []).map(g => ({genre: g})),
				{level: mock.tag.level},
				{mbReleaseID: mock.tag.mbReleaseID},
				{mbArtistID: mock.tag.mbArtistID},
				{newerThan: mock.stat.created - 1},
				{fromYear: mock.tag.year, toYear: mock.tag.year},
				{types: [mock.tag.type]},
				{query: (mock.tag.title || '')[0]}
			];
			return matches;
		},
		() => {
			it('should match the right inPath', async () => {
				const folder1 = mockFolder();
				folder1.path = mockPath('folder 10');
				folder1.id = await folderStore.add(folder1);
				const folder2 = mockFolder2();
				folder2.path = mockPath('folder 1');
				folder2.id = await folderStore.add(folder2);
				let list = await folderStore.search({inPath: removeTrailingPathSeparator(folder2.path)});
				expect(list.items.length).toBe(1);
				list = await folderStore.search({inPath: removeTrailingPathSeparator(folder1.path)});
				expect(list.items.length).toBe(1);
			});
		});
});

import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderStore, SearchQueryFolder} from './folder.store';
import {Folder} from './folder.model';
import path from 'path';
import {testStore} from '../base/base.store.spec';
import {mockFolder, mockFolder2} from './folder.mock';

describe('FolderStore', () => {
	let folderStore: FolderStore;

	testStore((testDB) => {
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
				{genre: mock.tag.genre},
				{level: mock.tag.level},
				{mbAlbumID: mock.tag.mbAlbumID},
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
				folder1.path = '/tmp/null/folder 10/';
				folder1.id = await folderStore.add(folder1);
				const folder2 = mockFolder2();
				folder2.path = '/tmp/null/folder 1/';
				folder2.id = await folderStore.add(folder2);
				const list = await folderStore.search({inPath: '/tmp/null/folder 1'});
				expect(list.length).to.equal(1);
			});
		});
});

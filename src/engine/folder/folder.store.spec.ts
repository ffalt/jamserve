import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {FolderStore, SearchQueryFolder} from './folder.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Folder} from './folder.model';
import path from 'path';
import {AlbumType, DBObjectType, FolderType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

function mockFolder(): Folder {
	return {
		id: '',
		type: DBObjectType.folder,
		rootID: 'rootID1',
		path: '/var/media/folder name',
		parentID: 'folderID2',
		stat: {
			created: 1543495268,
			modified: 1543495269
		},
		tag: {
			tracks: 10,
			level: 1,
			type: FolderType.album,
			genre: 'a genre',
			album: 'an album name',
			artist: 'an artist name',
			artistSort: 'artist sort name, an',
			albumType: AlbumType.album,
			title: 'a title',
			image: 'folder.jpg',
			year: 1984,
			mbAlbumID: 'mbAlbumID',
			mbArtistID: 'mbArtistID'
		}
	};
}

describe('FolderStore', () => {

	const testDB = new TestNeDB();
	let folderStore: FolderStore;

	before(async () => {
		await testDB.setup();
		folderStore = new FolderStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = folderStore;
		this.obj = mockFolder();
		this.generateMatchingQueries = (mock: Folder) => {
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
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});


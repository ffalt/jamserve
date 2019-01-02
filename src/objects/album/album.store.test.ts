import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {AlbumStore, SearchQueryAlbum} from './album.store';
import {Album} from './album.model';
import {testStore} from '../base/base.store.spec';
import {generateMockObjects} from './album.mock';

describe('AlbumStore', () => {
	let albumStore: AlbumStore;

	testStore((testDB) => {
			albumStore = new AlbumStore(testDB.database);
			return albumStore;
		}, generateMockObjects,
		(mock: Album) => {
			const matches: Array<SearchQueryAlbum> = [
				{id: mock.id},
				{ids: [mock.id]},
				{name: mock.name},
				{artist: mock.artist},
				{artistID: mock.artistID},
				{mbAlbumID: mock.mbAlbumID},
				{mbArtistID: mock.mbArtistID},
				{slug: mock.slug},
				{genre: mock.genre},
				{trackIDs: mock.trackIDs},
				{newerThan: mock.created - 1},
				{fromYear: mock.year, toYear: mock.year},
				{query: mock.name[0]}
			];
			mock.rootIDs.forEach(rootID => matches.push({rootID}));
			mock.trackIDs.forEach(trackID => matches.push({trackID}));
			return matches;
		},
		() => {
		});
});

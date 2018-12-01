import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {AlbumStore, SearchQueryAlbum} from './album.store';
import {Album} from './album.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';

function mockAlbum(): Album {
	return {
		id: '',
		type: DBObjectType.album,
		name: 'album name',
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

function mockAlbum2(): Album {
	return {
		id: '',
		type: DBObjectType.album,
		name: 'second album name',
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

describe('AlbumStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let albumStore: AlbumStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					albumStore = new AlbumStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = albumStore;
				this.generateMockObjects = () => {
					return [mockAlbum(), mockAlbum2()];
				};
				this.generateMatchingQueries = (mock: Album) => {
					const matches: Array<SearchQueryAlbum> = [
						{id: mock.id},
						{ids: [mock.id]},
						{name: mock.name},
						{artist: mock.artist},
						{artistID: mock.artistID},
						{mbAlbumID: mock.mbAlbumID},
						{mbArtistID: mock.mbArtistID},
						{genre: mock.genre},
						{trackIDs: mock.trackIDs},
						{newerThan: mock.created - 1},
						{fromYear: mock.year, toYear: mock.year},
						{query: mock.name[0]}
					];
					mock.rootIDs.forEach(rootID => matches.push({rootID}));
					mock.trackIDs.forEach(trackID => matches.push({trackID}));
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});


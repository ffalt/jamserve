import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Artist} from './Artist.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

function mockArtist(): Artist {
	return {
		id: '',
		type: DBObjectType.artist,
		name: 'artist name',
		rootIDs: ['rootID1', 'rootID2'],
		trackIDs: ['trackID1', 'trackID2'],
		albumIDs: ['albumID1', 'albumID2'],
		mbArtistID: 'mbArtistID',
		created: 1543495268
	};
}

describe('ArtistStore', () => {

	const testDB = new TestNeDB();
	let artistStore: ArtistStore;

	before(async () => {
		await testDB.setup();
		artistStore = new ArtistStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = artistStore;
		this.obj = mockArtist();
		this.generateMatchingQueries = (mock: Artist) => {
			const matches: Array<SearchQueryArtist> = [
				{id: mock.id},
				{ids: [mock.id]},
				{name: mock.name},
				{names: [mock.name]},
				{trackIDs: mock.trackIDs},
				{mbArtistID: mock.mbArtistID},
				{newerThan: mock.created - 1},
				{query: mock.name[0]}
			];
			mock.albumIDs.forEach(albumID => matches.push({albumID}));
			mock.rootIDs.forEach(rootID => matches.push({rootID}));
			mock.trackIDs.forEach(trackID => matches.push({trackID}));
			return matches;
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});


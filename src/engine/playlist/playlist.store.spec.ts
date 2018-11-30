import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {PlaylistStore, SearchQueryPlaylist} from './playlist.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {Playlist} from './playlist.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

function mockPlaylist(): Playlist {
	return {
		id: '',
		type: DBObjectType.playlist,
		name: 'a name',
		userID: 'userID1',
		comment: 'a comment',
		coverArt: 'playlistID1.jpg',
		created: 1543495268,
		changed: 1543495269,
		allowedUser: ['userID1', 'userID2'],
		isPublic: false,
		duration: 12345,
		trackIDs: ['trackID1', 'trackID2']
	};
}

function mockPlaylist2(): Playlist {
	return {
		id: '',
		type: DBObjectType.playlist,
		name: 'second name',
		userID: 'userID2',
		comment: 'second comment',
		coverArt: 'playlistID2.jpg',
		created: 1543495268,
		changed: 1543495269,
		allowedUser: [],
		isPublic: true,
		duration: 54321,
		trackIDs: ['trackID3', 'trackID4']
	};
}

describe('PlaylistStore', () => {

	const testDB = new TestNeDB();
	let playlistStore: PlaylistStore;

	before(async () => {
		await testDB.setup();
		playlistStore = new PlaylistStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = playlistStore;
		this.generateMockObjects = () => {
			return [mockPlaylist(), mockPlaylist2()];
		};
		this.generateMatchingQueries = (mock: Playlist) => {
			const matches: Array<SearchQueryPlaylist> = [
				{id: mock.id},
				{ids: [mock.id]},
				{name: mock.name},
				{userID: mock.userID},
				{trackIDs: mock.trackIDs},
				{isPublic: mock.isPublic},
				{newerThan: mock.created - 1},
				{query: mock.name[0]}
			];
			mock.trackIDs.forEach(trackID => matches.push({trackID}));
			return matches;
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});


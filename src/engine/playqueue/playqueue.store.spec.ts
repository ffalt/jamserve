import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {PlayQueueStore, SearchQueryPlayQueue} from './playqueue.store';
import {TestNeDB} from '../../db/nedb/db-nedb.test';
import {PlayQueue} from './playqueue.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';

function mockPlayQueue(): PlayQueue {
	return {
		id: '',
		type: DBObjectType.playqueue,
		userID: 'userID1',
		currentID: 'trackID1',
		trackIDs: ['trackID1', 'trackID2'],
		position: 1234,
		changed: 1543495268,
		changedBy: 'jamberry'
	};
}

describe('PlayQueueStore', () => {

	const testDB = new TestNeDB();
	let playqueueStore: PlayQueueStore;

	before(async () => {
		await testDB.setup();
		playqueueStore = new PlayQueueStore(testDB.database);
	});

	after(async () => {
		await testDB.cleanup();
	});

	beforeEach(function() {
		this.store = playqueueStore;
		this.obj = mockPlayQueue();
		this.generateMatchingQueries = (mock: PlayQueue) => {
			const matches: Array<SearchQueryPlayQueue> = [
				{userID: mock.userID}
			];
			return matches;
		};
	});

	describe('DBObject Store', () => {
		shouldBehaveLikeADBObjectStore();
	});

});


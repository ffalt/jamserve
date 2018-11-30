import {expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {PlayQueueStore, SearchQueryPlayQueue} from './playqueue.store';
import {PlayQueue} from './playqueue.model';
import {DBObjectType} from '../../types';
import {shouldBehaveLikeADBObjectStore} from '../base/base.store.spec';
import {TestDBs} from '../../db/db.test';

function mockPlayQueue(): PlayQueue {
	return {
		id: '',
		type: DBObjectType.playqueue,
		userID: 'userID1',
		currentID: 'trackID1',
		trackIDs: ['trackID1', 'trackID2'],
		position: 1234,
		changed: 1543495268,
		changedBy: 'berry'
	};
}

function mockPlayQueue2(): PlayQueue {
	return {
		id: '',
		type: DBObjectType.playqueue,
		userID: 'userID2',
		currentID: 'trackID3',
		trackIDs: ['trackID3', 'trackID4'],
		position: 54321,
		changed: 1443495268,
		changedBy: 'boree'
	};
}

describe('PlayQueueStore', () => {

	const testDBs = new TestDBs();

	for (const testDB of testDBs.dbs) {
		describe(testDB.name, () => {
			let playqueueStore: PlayQueueStore;

			before(function(done) {
				this.timeout(40000);
				testDB.setup().then(() => {
					playqueueStore = new PlayQueueStore(testDB.database);
					done();
				}).catch(e => {
					throw e;
				});
			});

			after(async () => {
				await testDB.cleanup();
			});

			beforeEach(function() {
				this.store = playqueueStore;
				this.generateMockObjects = () => {
					return [mockPlayQueue(), mockPlayQueue2()];
				};
				this.generateMatchingQueries = (mock: PlayQueue) => {
					const matches: Array<SearchQueryPlayQueue> = [
						{userID: mock.userID}
					];
					return matches;
				};
			});

			shouldBehaveLikeADBObjectStore();
		});

	}
});

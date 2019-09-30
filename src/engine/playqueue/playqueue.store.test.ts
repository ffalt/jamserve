import {testStore} from '../base/base.store.spec';
import {mockPlayQueue, mockPlayQueue2} from './playqueue.mock';
import {PlayQueue} from './playqueue.model';
import {PlayQueueStore, SearchQueryPlayQueue} from './playqueue.store';

describe('PlayQueueStore', () => {
	let playqueueStore: PlayQueueStore;

	testStore(testDB => {
			playqueueStore = new PlayQueueStore(testDB.database);
			return playqueueStore;
		}, () => {
			return [mockPlayQueue(), mockPlayQueue2()];
		}, (mock: PlayQueue) => {
			const matches: Array<SearchQueryPlayQueue> = [
				{userID: mock.userID}
			];
			return matches;
		},
		() => {
			// nope
		}
	);
});

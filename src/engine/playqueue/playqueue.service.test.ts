import {testService} from '../base/base.service.spec';
import {PlayQueueService} from './playqueue.service';

describe('PlayQueueService', () => {
	let playQueueService: PlayQueueService;
	testService({mockData: false},
		async store => {
			playQueueService = new PlayQueueService(store.playQueueStore);
		},
		() => {
			it('should create an empty playqueue', async () => {
				const playQueue = await playQueueService.save('userID1', ['trackID1'], 'trackID1', 10, 'testClient');
				expect(playQueue).toBeTruthy();
			});
			it('should find the playqueue', async () => {
				const playQueue = await playQueueService.get('userID1');
				expect(playQueue).toBeTruthy();
			});
			it('should remove the playqueue', async () => {
				await playQueueService.remove('userID1');
				const playQueue = await playQueueService.get('userID1');
				expect(playQueue).toBeUndefined();
			});
			it('should get or create the playqueue', async () => {
				await playQueueService.getQueueOrCreate('userID1', 'testClient');
				const playQueue = await playQueueService.get('userID1');
				expect(playQueue).toBeTruthy();
			});
			it('should overwrite the playqueue', async () => {
				await playQueueService.save('userID1', ['trackID1', 'trackID2'], 'trackID2', 5, 'testClient');
				const playQueue = await playQueueService.get('userID1');
				expect(playQueue).toBeTruthy();
				if (playQueue) {
					expect(playQueue.trackIDs.length).toBe(2);
				}
				await playQueueService.remove('userID1');
			});
		}
	);
});

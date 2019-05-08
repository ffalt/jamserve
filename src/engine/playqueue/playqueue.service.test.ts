import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {PlayQueueService} from './playqueue.service';

describe('PlayQueueService', () => {
	let playQueueService: PlayQueueService;
	testService({mockData: false},
		async (store, imageModuleTest) => {
			playQueueService = new PlayQueueService(store.playQueueStore);
		},
		() => {
			it('should create an empty playqueue', async () => {
				const playQueue = await playQueueService.save('userID1', ['trackID1'], 'trackID1', 10, 'testClient');
				should().exist(playQueue);
			});
			it('should find the playqueue', async () => {
				const playQueue = await playQueueService.get('userID1');
				should().exist(playQueue);
			});
			it('should remove the playqueue', async () => {
				await playQueueService.remove('userID1');
				const playQueue = await playQueueService.get('userID1');
				should().not.exist(playQueue);
			});
			it('should get or create the playqueue', async () => {
				await playQueueService.getQueueOrCreate('userID1', 'testClient');
				const playQueue = await playQueueService.get('userID1');
				should().exist(playQueue);
			});
			it('should overwrite the playqueue', async () => {
				await playQueueService.save('userID1', ['trackID1', 'trackID2'], 'trackID2', 5, 'testClient');
				const playQueue = await playQueueService.get('userID1');
				should().exist(playQueue);
				if (playQueue) {
					expect(playQueue.trackIDs.length).to.be.equal(2);
				}
				await playQueueService.remove('userID1');
			});
		}
	);
});

import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {mockUser} from '../../objects/user/user.mock';
import {StreamService} from './stream.service';
import {TrackStore} from '../../objects/track/track.store';

describe('StreamService', () => {
	let streamService: StreamService;
	let trackStore: TrackStore;
	const user = mockUser();
	user.id = 'nowPlayingUserID1';
	testService(
		(storeTest, imageModuleTest) => {
			streamService = new StreamService();
			trackStore = storeTest.store.trackStore;
		},
		() => {
			it('should return an empty list', async () => {
				const tracks = await trackStore.all();
				expect(tracks.length > 0).to.be.equal(true, 'Wrong Test Setup');
				const res = await streamService.streamTrack(tracks[0], undefined, undefined, user);
				should().exist(res);
			});
		}
	);
});

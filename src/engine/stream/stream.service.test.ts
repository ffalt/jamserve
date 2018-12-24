import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {mockUser} from '../../objects/user/user.mock';
import {StreamService} from './stream.service';
import {TrackStore} from '../../objects/track/track.store';
import {SupportedTranscodeAudioFormat} from '../../utils/filetype';
import {mockTrack} from '../../objects/track/track.mock';
import {mockEpisode} from '../../objects/episode/episode.mock';
import path from 'path';

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
			it('should stream a track', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				let res = await streamService.streamTrack(track, undefined, undefined, user);
				should().exist(res);
				should().exist(res.file);
				for (const format of SupportedTranscodeAudioFormat) {
					res = await streamService.streamTrack(track, format, undefined, user);
					should().exist(res);
					expect(!!res.file || !!res.pipe).to.be.equal(true, 'Invalid result');
				}
				track.media.format = undefined;
				res = await streamService.streamTrack(track, undefined, undefined, user);
				should().exist(res);
				should().exist(res.file);
			});
			it('should fail streaming a track if file does not exists', async () => {
				const mock = mockTrack();
				mock.path = '/dev/null';
				mock.name = 'notexisting.mp3';
				await streamService.streamTrack(mock, undefined, undefined, user).should.eventually.be.rejectedWith(Error);
			});
			it('should not stream invalid settings', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				await streamService.streamTrack(track, 'invalid', undefined, user).should.eventually.be.rejectedWith(Error);
				await streamService.streamTrack(track, '.invalid', undefined, user).should.eventually.be.rejectedWith(Error);
			});
			it('should stream a episode', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				const mock = mockEpisode();
				mock.path = path.join(track.path, track.name);
				mock.media = track.media;
				const res = await streamService.streamEpisode(mock, undefined, undefined, user);
				should().exist(res);
				should().exist(res.file);
			});
			it('should fail streaming a episode if file does not exists', async () => {
				const mock = mockEpisode();
				mock.path = '/dev/null/notexisting.mp3';
				await streamService.streamEpisode(mock, undefined, undefined, user).should.eventually.be.rejectedWith(Error);
				mock.path = undefined;
				await streamService.streamEpisode(mock, undefined, undefined, user).should.eventually.be.rejectedWith(Error);
				mock.path = '/dev/null/notexisting.mp3';
				mock.media = undefined;
				await streamService.streamEpisode(mock, undefined, undefined, user).should.eventually.be.rejectedWith(Error);
			});

		}
	);
});

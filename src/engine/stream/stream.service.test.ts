import path from 'path';

import {SupportedTranscodeAudioFormat} from '../../utils/filetype';
import {testService} from '../base/base.service.spec';
import {mockEpisode} from '../episode/episode.mock';
import {mockTrack} from '../track/track.mock';
import {TrackStore} from '../track/track.store';
import {mockUser} from '../user/user.mock';
import {StreamService} from './stream.service';

describe('StreamService', () => {
	let streamService: StreamService;
	let trackStore: TrackStore;
	const user = mockUser();
	user.id = 'nowPlayingUserID1';
	testService({mockData: true},
		async (store, imageModuleTest) => {
			streamService = new StreamService();
			trackStore = store.trackStore;
		},
		() => {
			it('should stream a track', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				let result = await streamService.streamTrack(track, undefined, undefined, undefined, user);
				expect(result).toBeTruthy();
				expect(result.file).toBeTruthy();
				for (const format of SupportedTranscodeAudioFormat) {
					result = await streamService.streamTrack(track, format, undefined, undefined, user);
					expect(result).toBeTruthy();
					expect(!!result.file || !!result.pipe).toBe(true); // 'Invalid result');
				}
				track.media.format = undefined;
				result = await streamService.streamTrack(track, undefined, undefined, undefined, user);
				expect(result).toBeTruthy();
				expect(result.file).toBeTruthy();
			});
			it('should fail streaming a track if file does not exists', async () => {
				const mock = mockTrack();
				mock.path = '/dev/null';
				mock.name = 'notexisting.mp3';
				await expect(streamService.streamTrack(mock, undefined, undefined, undefined, user)).rejects.toThrow('File not found');
			});
			it('should not stream invalid settings', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				await expect(streamService.streamTrack(track, 'invalid', undefined, undefined, user)).rejects.toThrow('Unsupported transcoding format');
				await expect(streamService.streamTrack(track, '.invalid', undefined, undefined, user)).rejects.toThrow('Unsupported transcoding format');
			});
			it('should stream a episode', async () => {
				const track = await trackStore.random();
				expect(track).toBeTruthy(); // 'Wrong Test Setup');
				if (!track) {
					return;
				}
				const mock = mockEpisode();
				mock.path = path.join(track.path, track.name);
				mock.media = track.media;
				const result = await streamService.streamEpisode(mock, undefined, undefined, undefined, user);
				expect(result).toBeTruthy();
				expect(result.file).toBeTruthy();
			});
			it('should fail streaming a episode if file does not exists', async () => {
				const mock = mockEpisode();
				mock.path = '/dev/null/notexisting.mp3';
				await expect(streamService.streamEpisode(mock, undefined, undefined, undefined, user)).rejects.toThrow('File not found');
				mock.path = undefined;
				await expect(streamService.streamEpisode(mock, undefined, undefined, undefined, user)).rejects.toThrow('Podcast episode not ready');
				mock.path = '/dev/null/notexisting.mp3';
				mock.media = undefined;
				await expect(streamService.streamEpisode(mock, undefined, undefined, undefined, user)).rejects.toThrow('Podcast episode not ready');
			});

		}
	);
});

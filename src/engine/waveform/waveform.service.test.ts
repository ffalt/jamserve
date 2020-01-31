import path from 'path';
import {WaveformFormatType} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {testService} from '../base/base.service.spec';
import {mockEpisode} from '../episode/episode.mock';
import {TrackStore} from '../track/track.store';
import {WaveformService} from './waveform.service';

describe('WaveformService', () => {
	let waveformService: WaveformService;
	let trackStore: TrackStore;
	let audioModule: AudioModule;
	testService({mockData: true},
		async (store, imageModuleTest, audioModuleTest) => {
			waveformService = new WaveformService(audioModuleTest.audioModule);
			trackStore = store.trackStore;
			audioModule = audioModuleTest.audioModule;
		},
		() => {
			it('should return svg for a track', async () => {
				const track = await trackStore.random();
				if (!track) {
					throw Error('Invalid Test Setup');
				}
				const result = await waveformService.getTrackWaveform(track, WaveformFormatType.svg);
				expect(result).toBeDefined();
				expect(result.file).toBeDefined();
				await audioModule.clearCacheByIDs([track.id]);
			});
			it('should return svg for an episode', async () => {
				const track = await trackStore.random();
				expect(track).toBeDefined(); // 'Invalid Test Setup');
				if (!track) {
					return;
				}
				const episode = mockEpisode();
				episode.path = path.resolve(track.path, track.name);
				episode.id = 'testEpisodeID';
				const result = await waveformService.getEpisodeWaveform(episode, WaveformFormatType.svg);
				expect(result).toBeDefined();
				expect(result.file).toBeDefined();
				await audioModule.clearCacheByIDs([track.id]);
			});
			it('should return json', async () => {
				const track = await trackStore.random();
				expect(track).toBeDefined(); // 'Invalid Test Setup');
				if (!track) {
					return;
				}
				const result = await waveformService.getTrackWaveform(track, WaveformFormatType.json);
				expect(result).toBeDefined();
				expect(result.file).toBeDefined();
				await audioModule.clearCacheByIDs([track.id]);
			});
			it('should return binary', async () => {
				const track = await trackStore.random();
				expect(track).toBeDefined(); // 'Invalid Test Setup');
				if (!track) {
					return;
				}
				const result = await waveformService.getTrackWaveform(track, WaveformFormatType.dat);
				expect(result).toBeDefined();
				expect(result.file).toBeDefined();
				await audioModule.clearCacheByIDs([track.id]);
			});
			it('should throw errors', async () => {
				const track = await trackStore.random();
				expect(track).toBeDefined(); // 'Invalid Test Setup');
				if (!track) {
					return;
				}
				await expect(waveformService.getTrackWaveform(track, 'invalid' as any)).rejects.toThrow('Invalid Format for Waveform generation');
				track.name = 'invalid.invalid.invalid';
				await expect(waveformService.getTrackWaveform(track, WaveformFormatType.svg)).rejects.toThrow('Invalid filename for waveform generation');
				const episode = mockEpisode();
				episode.path = undefined;
				episode.id = 'testEpisodeID';
				await expect(waveformService.getEpisodeWaveform(episode, WaveformFormatType.svg)).rejects.toThrow('Podcast episode not ready');
			});
			it('should block creating a waveform while creating a waveform', async () => {
				const track = await trackStore.random();
				expect(track).toBeDefined(); // 'Invalid Test Setup');
				if (!track) {
					return;
				}
				const promise = waveformService.getTrackWaveform(track, WaveformFormatType.svg);
				const result = await waveformService.getTrackWaveform(track, WaveformFormatType.svg);
				const result2 = await promise;
				expect(result).toBeDefined();
				expect(result.file).toBeDefined();
				expect(result2).toBeDefined();
				expect(result2.file).toBeDefined();
				await audioModule.clearCacheByIDs([track.id]);
			});
		}
	);
});

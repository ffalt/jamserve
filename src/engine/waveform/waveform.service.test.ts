import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {WaveformService} from './waveform.service';
import tmp, {SynchrounousResult} from 'tmp';
import path from 'path';
import {TrackStore} from '../../objects/track/track.store';
import {mockEpisode} from '../../objects/episode/episode.mock';

describe('WaveformService', () => {
	let waveformService: WaveformService;
	let dir: SynchrounousResult;
	let trackStore: TrackStore;
	testService(
		(storeTest, imageModuleTest) => {
			dir = tmp.dirSync();
			waveformService = new WaveformService(dir.name);
			trackStore = storeTest.store.trackStore;
		},
		() => {
			it('should return svg for a track', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				let res = await waveformService.getTrackWaveform(track, 'svg');
				should().exist(res);
				should().exist(res.buffer);
				if (!res.buffer) {
					return;
				}
				expect(res.buffer.contentType).to.be.equal('image/svg+xml');
				res = await waveformService.getTrackWaveform(track, 'svg');
				should().exist(res.file);
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
			it('should return svg for an episode', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				const episode = mockEpisode();
				episode.path = path.resolve(track.path, track.name);
				episode.id = 'testEpisodeID';
				let res = await waveformService.getEpisodeWaveform(episode, 'svg');
				should().exist(res);
				should().exist(res.buffer);
				if (!res.buffer) {
					return;
				}
				expect(res.buffer.contentType).to.be.equal('image/svg+xml');
				res = await waveformService.getEpisodeWaveform(episode, 'svg');
				should().exist(res.file);
				await waveformService.clearWaveformCacheByIDs([episode.id]);
			});
			it('should return json', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				let res = await waveformService.getTrackWaveform(track, 'json');
				should().exist(res);
				should().exist(res.json);
				if (!res.json) {
					return;
				}
				res = await waveformService.getTrackWaveform(track, 'json');
				should().exist(res.file);
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
			it('should return binary', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				let res = await waveformService.getTrackWaveform(track, 'dat');
				should().exist(res);
				should().exist(res.buffer);
				if (!res.buffer) {
					return;
				}
				expect(res.buffer.contentType).to.be.equal('application/binary');
				res = await waveformService.getTrackWaveform(track, 'dat');
				should().exist(res.file);
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
			it('should throw errors', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				await waveformService.getTrackWaveform(track, <any>'invalid').should.eventually.be.rejectedWith(Error);
				track.name = 'invalid.invalid.invalid';
				await waveformService.getTrackWaveform(track, 'svg').should.eventually.be.rejectedWith(Error);
				const episode = mockEpisode();
				episode.path = undefined;
				episode.id = 'testEpisodeID';
				await waveformService.getEpisodeWaveform(episode, 'svg').should.eventually.be.rejectedWith(Error);
			});
			it('should block creating a waveform while creating a waveform', async () => {
				const track = await trackStore.random();
				should().exist(track, 'Wrong Test Setup');
				if (!track) {
					return;
				}
				const promise = waveformService.getTrackWaveform(track, 'svg');
				const res = await waveformService.getTrackWaveform(track, 'svg');
				const res2 = await promise;
				should().exist(res);
				should().exist(res.buffer);
				should().exist(res2);
				should().exist(res2.buffer);
				await waveformService.clearWaveformCacheByIDs([track.id]);
			});
		},
		async () => {
			dir.removeCallback();
		}
	);
});

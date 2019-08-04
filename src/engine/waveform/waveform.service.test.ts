import {expect, should} from 'chai';
import {describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
import {WaveformService} from './waveform.service';
import tmp from 'tmp';
import path from 'path';
import {TrackStore} from '../track/track.store';
import {mockEpisode} from '../episode/episode.mock';

describe('WaveformService', () => {
	let waveformService: WaveformService;
	let dir: tmp.DirResult;
	let trackStore: TrackStore;
	testService({mockData: true},
		async (store, imageModuleTest) => {
			dir = tmp.dirSync();
			waveformService = new WaveformService(dir.name);
			trackStore = store.trackStore;
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

import fse from 'fs-extra';
import path from 'path';
import {JamParameters} from '../../model/jam-rest-params';
import {WaveformFormatType} from '../../model/jam-types';
import {WaveformGenerator} from '../../modules/audio/waveform/waveform.generator';
import {ApiBinaryResult} from '../../typings';
import {DebouncePromises} from '../../utils/debounce-promises';
import {logger} from '../../utils/logger';
import {Episode} from '../episode/episode.model';
import {Track} from '../track/track.model';

const log = logger('WaveformService');

export class WaveformService {
	private waveformCacheDebounce = new DebouncePromises<ApiBinaryResult>();

	constructor(private waveformCachePath: string) {
	}

	private getCacheID(id: string, format: string, width?: number): string {
		return `waveform-${id}${width !== undefined ? `-${width}` : ''}.${format}`;
	}

	private async generateWaveform(filename: string, format: JamParameters.WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		const wf = new WaveformGenerator();
		switch (format) {
			case WaveformFormatType.svg:
				const svg = await wf.svg(filename, width);
				return {buffer: {buffer: Buffer.from(svg, 'ascii'), contentType: 'image/svg+xml'}};
			case WaveformFormatType.json:
				return {json: await wf.json(filename)};
			case WaveformFormatType.dat:
				return {buffer: {buffer: await wf.binary(filename), contentType: 'application/binary'}};
			default:
		}
		return Promise.reject(Error('Invalid Format for Waveform generation'));
	}

	async clearWaveformCacheByIDs(ids: Array<string>): Promise<void> {
		const searches = ids.filter(id => id.length > 0).map(id => this.getCacheID(id, ''));
		if (searches.length > 0) {
			let list = await fse.readdir(this.waveformCachePath);
			list = list.filter(name => {
				return searches.findIndex(s => name.startsWith(s)) >= 0;
			});
			for (const filename of list) {
				await fse.unlink(path.resolve(this.waveformCachePath, filename));
			}
		}
	}

	private async get(id: string, filename: string, format: WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		if (!filename || !(await fse.pathExists(filename))) {
			return Promise.reject(Error('Invalid filename for waveform generation'));
		}
		const cacheID = this.getCacheID(id, format, width);
		if (this.waveformCacheDebounce.isPending(cacheID)) {
			return this.waveformCacheDebounce.append(cacheID);
		}
		this.waveformCacheDebounce.setPending(cacheID);
		try {
			let result: ApiBinaryResult;
			const cachefile = path.join(this.waveformCachePath, cacheID);
			const exists = await fse.pathExists(cachefile);
			if (exists) {
				result = {file: {filename: cachefile, name: cacheID}};
			} else {
				result = await this.generateWaveform(filename, format, width);
				if (result.buffer) {
					log.debug('Writing waveform cache file', cachefile);
					await fse.writeFile(cachefile, result.buffer.buffer);
				} else if (result.json) {
					log.debug('Writing waveform cache file', cachefile);
					await fse.writeFile(cachefile, JSON.stringify(result.json));
				}
			}
			this.waveformCacheDebounce.resolve(cacheID, result);
			return result;
		} catch (e) {
			this.waveformCacheDebounce.reject(cacheID, e);
			return Promise.reject(e);
		}
	}

	async getTrackWaveform(track: Track, format: WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		return this.get(track.id, path.join(track.path, track.name), format, width);
	}

	async getEpisodeWaveform(episode: Episode, format: WaveformFormatType, width?: number): Promise<ApiBinaryResult> {
		if (episode.path && episode.media) {
			return this.get(episode.id, episode.path, format, width);
		}
		return Promise.reject(Error('Podcast episode not ready'));
	}
}

import path from 'path';
import Logger from '../../utils/logger';
import {dirRead, fileDelete, fileExists, fileWrite} from '../../utils/fs-utils';
import {IApiBinaryResult} from '../../typings';
import {Config} from '../../config';
import {DebouncePromises} from '../../utils/debounce-promises';
import {getWaveFormBinary, getWaveFormJSON, getWaveFormSVG} from '../../audio/tools/ffmpeg-waveform-svg';
import {JamServe} from '../../model/jamserve';

const log = Logger('WaveForms');

export class Waveforms {
	private waveformCachePath: string;
	private waveformCacheDebounce = new DebouncePromises<IApiBinaryResult>();

	constructor(config: Config) {
		this.waveformCachePath = config.getDataPath(['cache', 'waveforms']);
	}

	private getCacheID(id: string, format: string): string {
		return 'waveform-' + id + '.' + format;
	}

	private async getWaveform(filename: string, format: string): Promise<IApiBinaryResult> {
		const exists = await fileExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		switch (format) {
			case 'svg':
				return {buffer: {buffer: Buffer.from(await getWaveFormSVG(filename)), contentType: 'image/svg+xml'}};
			case 'json':
				return {json: await getWaveFormJSON(filename)};
			case 'dat':
				return {buffer: {buffer: await getWaveFormBinary(filename), contentType: 'application/binary'}};
			default:
				return Promise.reject(Error('Invalid Format for Waveform generation'));
		}
	}

	async clearWaveformCacheByID(id: string): Promise<void> {
		if (id.length === 0) {
			return;
		}
		await this.clearWaveformCacheByIDs([id]);
	}

	async clearWaveformCacheByIDs(ids: Array<string>): Promise<void> {
		const searches = ids.filter(id => id.length > 0).map(id => this.getCacheID(id, ''));
		if (searches.length > 0) {
			let list = await dirRead(this.waveformCachePath);
			list = list.filter(name => {
				return searches.findIndex(s => name.indexOf(s) === 0) >= 0;
			});
			for (const filename of list) {
				await fileDelete(path.resolve(this.waveformCachePath, filename));
			}
		}
	}

	async get(id: string, filename: string, format: string, media: JamServe.TrackMedia): Promise<IApiBinaryResult> {
		if (!filename) {
			return Promise.reject(Error('Invalid Media Path for Waveform generation'));
		}
		const cacheID = this.getCacheID(id, format);
		if (this.waveformCacheDebounce.isPending(cacheID)) {
			return this.waveformCacheDebounce.append(cacheID);
		}
		this.waveformCacheDebounce.setPending(cacheID);
		try {
			let result: IApiBinaryResult;
			const cachefile = path.join(this.waveformCachePath, cacheID);
			const exists = await fileExists(cachefile);
			if (exists) {
				result = {file: {filename: cachefile, name: cacheID}};
			} else {
				result = await this.getWaveform(filename, format);
				if (result.buffer) {
					log.debug('Writing waveform cache file', cachefile);
					await fileWrite(cachefile, result.buffer.buffer);
				} else if (result.json) {
					log.debug('Writing waveform cache file', cachefile);
					await fileWrite(cachefile, JSON.stringify(result.json));
				}
			}
			await this.waveformCacheDebounce.resolve(cacheID, result);
			return result;
		} catch (e) {
			await this.waveformCacheDebounce.reject(cacheID, e);
			return Promise.reject(e);
		}
	}

}

import path from 'path';
import Logger from '../../utils/logger';
import {dirRead, fileDelete, fileDeleteIfExists, fileExists, fileWrite} from '../../utils/fs-utils';
import {IApiBinaryResult} from '../../typings';
import {Config} from '../../config';
import {DebouncePromises} from '../../utils/debounce-promises';
import {getWaveFormSVG} from '../../audio/tools/ffmpeg-waveform-svg';
import {JamServe} from '../../model/jamserve';

const log = Logger('WaveForms');

export class Waveforms {
	private waveformCachePath: string;
	private waveformCacheDebounce = new DebouncePromises<IApiBinaryResult>();

	constructor(config: Config) {
		this.waveformCachePath = config.getDataPath(['cache', 'waveforms']);
	}

	private getCacheID(id: string): string {
		return 'waveform-' + id + '.svg';
	}

	private async getWaveform(filename: string, name: string): Promise<IApiBinaryResult> {
		const exists = await fileExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		const data = await getWaveFormSVG(filename);
		return {buffer: {buffer: Buffer.from(data), contentType: 'image/svg+xml'}};
	}

	async clearWaveformCacheByID(id: string): Promise<void> {
		if (id.length === 0) {
			return;
		}
		const cacheID = this.getCacheID(id);
		const filename = path.join(this.waveformCachePath, cacheID);
		await fileDeleteIfExists(filename);
	}

	async clearWaveformCacheByIDs(ids: Array<string>): Promise<void> {
		const searches = ids.filter(id => id.length > 0).map(id => this.getCacheID(id));
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

	async get(id: string, filename: string, media: JamServe.TrackMedia): Promise<IApiBinaryResult> {
		if (!filename) {
			return Promise.reject(Error('Invalid Path'));
		}
		const cacheID = this.getCacheID(id);
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
				result = await this.getWaveform(filename, cacheID);
				if (result.buffer) {
					log.debug('Writing waveform cache file', cachefile);
					await fileWrite(cachefile, result.buffer.buffer);
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

import {IDFolderCache} from '../../../utils/id-file-cache';
import {WaveformGenerator} from './waveform.generator';
import fse from 'fs-extra';
import {logger} from '../../../utils/logger';
import {WaveformFormatType} from '../../../types/enums';

const log = logger('Audio:Waveform');


export interface WaveformResult {
	file?: { filename: string; name: string };
	json?: any;
	buffer?: {
		buffer: Buffer;
		contentType: string;
	};
	name?: string;
}

export class WaveformModule {
	private waveformCache: IDFolderCache<{ width?: number; format: string }>;

	constructor(waveformCachePath: string) {
		this.waveformCache = new IDFolderCache<{ width?: number; format: string }>(waveformCachePath, 'waveform', (params: { width?: number; format: string }) => {
			return `${params.width !== undefined ? `-${params.width}` : ''}.${params.format}`;
		});
	}

	private async generateWaveform(filename: string, format: WaveformFormatType, width?: number): Promise<WaveformResult> {
		const wf = new WaveformGenerator();
		switch (format) {
			case WaveformFormatType.svg:
				return {buffer: {buffer: Buffer.from(await wf.svg(filename, width), 'ascii'), contentType: 'image/svg+xml'}};
			case WaveformFormatType.json:
				return {json: await wf.json(filename)};
			case WaveformFormatType.dat:
				return {buffer: {buffer: await wf.binary(filename), contentType: 'application/binary'}};
			default:
		}
		return Promise.reject(Error('Invalid Format for Waveform generation'));
	}

	async get(id: string, filename: string, format: WaveformFormatType, width?: number): Promise<WaveformResult> {
		if (!filename || !(await fse.pathExists(filename))) {
			return Promise.reject(Error('Invalid filename for waveform generation'));
		}
		return this.waveformCache.get(id, {format, width}, async cacheFilename => {
			const result = await this.generateWaveform(filename, format, width);
			log.debug('Writing cache file', cacheFilename);
			if (result.buffer) {
				await fse.writeFile(cacheFilename, result.buffer.buffer);
			} else if (result.json) {
				await fse.writeFile(cacheFilename, JSON.stringify(result.json));
			} else {
				throw  new Error('Invalid waveform generation result');
			}
		});
	}

	async clearCacheByIDs(ids: Array<string>): Promise<void> {
		await this.waveformCache.removeByIDs(ids);
	}
}

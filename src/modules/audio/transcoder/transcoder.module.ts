import { TranscoderStream } from './transcoder-stream.js';
import { IDFolderCache } from '../../../utils/id-file-cache.js';
import { logger } from '../../../utils/logger.js';
import { AudioFormatType } from '../../../types/enums.js';

const log = logger('Audio:Transcoder');

export interface TranscoderResult {
	file: {
		filename: string;
		name: string;
	};
}

export class TranscoderModule {
	private readonly transcodeCache: IDFolderCache<{ maxBitRate?: number; format: string }>;

	constructor(transcodeCachePath: string) {
		this.transcodeCache = new IDFolderCache<{ maxBitRate?: number; format: string }>(
			transcodeCachePath,
			'transcode',
			(params: { maxBitRate?: number; format: string }) => {
				let suffix = '';
				if (params.maxBitRate) {
					suffix = `-${params.maxBitRate}`;
				}
				return `${suffix}.${params.format}`;
			}
		);
	}

	async get(filename: string, id: string, format: string, maxBitRate: number): Promise<TranscoderResult> {
		if (!TranscoderStream.validTranscoding(format as AudioFormatType)) {
			return Promise.reject(Error('Unsupported transcoding format'));
		}
		return this.transcodeCache.get(id, { format, maxBitRate }, async cacheFilename => {
			log.debug('Writing transcode cache file', cacheFilename);
			await TranscoderStream.transcodeToFile(filename, cacheFilename, format, maxBitRate);
		});
	}

	async clearCacheByIDs(ids: Array<string>): Promise<void> {
		await this.transcodeCache.removeByIDs(ids);
	}
}

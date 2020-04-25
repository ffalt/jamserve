import {ApiBinaryResult} from '../../../typings';
import {TranscoderStream} from './transcoder-stream';
import {AudioFormatType} from '../../../model/jam-types';
import {IDFolderCache} from '../../../utils/id-file-cache';
import {logger} from '../../../utils/logger';

const log = logger('Audio:Transcoder');

export class TranscoderModule {
	private transcodeCache: IDFolderCache<{ maxBitRate?: number; format: string }>;

	constructor(transcodeCachePath: string) {
		this.transcodeCache = new IDFolderCache<{ maxBitRate?: number; format: string }>(transcodeCachePath, 'transcode',
			(params: { maxBitRate?: number; format: string }) => `${params.maxBitRate ? `-${params.maxBitRate}` : ''}.${params.format}`);
	}

	async get(filename: string, id: string, format: string, maxBitRate: number): Promise<ApiBinaryResult> {
		if (!TranscoderStream.validTranscoding(format as AudioFormatType)) {
			return Promise.reject(Error('Unsupported transcoding format'));
		}
		// if (live) {
		// 	return {pipe: new LiveTranscoderStream(filename, destFormat, maxBitRate)};
		// }
		return this.transcodeCache.get(id, {format, maxBitRate}, async cacheFilename => {
			log.debug('Writing transcode cache file', cacheFilename);
			await TranscoderStream.transcodeToFile(filename, cacheFilename, format, maxBitRate);
		});
	}


	async clearCacheByIDs(ids: Array<string>): Promise<void> {
		await this.transcodeCache.removeByIDs(ids);
	}

}

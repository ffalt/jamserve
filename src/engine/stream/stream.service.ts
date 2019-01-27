import {IApiBinaryResult} from '../../typings';
import {PreTranscoder, Transcoder} from '../../modules/audio/transcoder';
import {fileSuffix} from '../../utils/fs-utils';
import path from 'path';
import fse from 'fs-extra';
import {GenericError} from '../../api/jam/error';
import {User} from '../../objects/user/user.model';
import {Track} from '../../objects/track/track.model';
import {Episode} from '../../objects/episode/episode.model';
import {AudioFormatType} from '../../model/jam-types';

export class StreamService {

	constructor() {

	}

	async streamFile(filename: string, id: string, sourceFormat?: string, destFormat?: string, maxBitRate?: number): Promise<IApiBinaryResult> {
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		destFormat = destFormat || AudioFormatType.mp3;
		if (destFormat[0] === '.') {
			destFormat = destFormat.slice(1);
		}
		const bitRate = maxBitRate || 0;
		if (destFormat !== 'raw' && Transcoder.needsTranscoding(sourceFormat || fileSuffix(filename), destFormat, bitRate)) {
			if (!Transcoder.validTranscoding(<AudioFormatType>destFormat)) {
				return Promise.reject(Error('Unsupported transcoding format'));
			}
			return {pipe: new PreTranscoder(filename, destFormat, bitRate)};
			// return {pipe: new Transcoder(filename, f, bitRate, media.duration)};
		} else {
			return {file: {filename, name: id + '.' + destFormat}};
		}
	}

	async streamTrack(track: Track, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<IApiBinaryResult> {
		return this.streamFile(path.join(track.path, track.name), track.id, track.media.format, format, maxBitRate);
	}

	async streamEpisode(episode: Episode, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<IApiBinaryResult> {
		if (episode.path && episode.media) {
			return this.streamFile(episode.path, episode.id, episode.media.format, format, maxBitRate);
		} else {
			return Promise.reject(GenericError('Podcast episode not ready'));
		}
	}


}

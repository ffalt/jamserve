import fse from 'fs-extra';
import path from 'path';
import {GenericError} from '../../api/jam/error';
import {AudioFormatType} from '../../model/jam-types';
import {PreTranscoderStream} from '../../modules/audio/transcoder/transcoder-pre-stream';
import {ApiBinaryResult} from '../../typings';
import {fileSuffix} from '../../utils/fs-utils';
import {Episode} from '../episode/episode.model';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';

export class StreamService {

	constructor() {

	}

	async streamFile(filename: string, id: string, sourceFormat?: string, destFormat?: string, maxBitRate?: number): Promise<ApiBinaryResult> {
		const exists = await fse.pathExists(filename);
		if (!exists) {
			return Promise.reject(Error('File not found'));
		}
		destFormat = destFormat || AudioFormatType.mp3;
		if (destFormat[0] === '.') {
			destFormat = destFormat.slice(1);
		}
		const bitRate = maxBitRate || 0;
		if (destFormat !== 'raw' && PreTranscoderStream.needsTranscoding(sourceFormat || fileSuffix(filename), destFormat, bitRate)) {
			if (!PreTranscoderStream.validTranscoding(destFormat as AudioFormatType)) {
				return Promise.reject(Error('Unsupported transcoding format'));
			}
			return {pipe: new PreTranscoderStream(filename, destFormat, bitRate)};
		} else {
			return {file: {filename, name: id + '.' + destFormat}};
		}
	}

	async streamTrack(track: Track, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		return this.streamFile(path.join(track.path, track.name), track.id, track.media.format, format, maxBitRate);
	}

	async streamEpisode(episode: Episode, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		if (episode.path && episode.media) {
			return this.streamFile(episode.path, episode.id, episode.media.format, format, maxBitRate);
		} else {
			return Promise.reject(GenericError('Podcast episode not ready'));
		}
	}

}

import fse from 'fs-extra';
import path from 'path';
import {GenericError} from '../../api/jam/error';
import {AudioFormatType} from '../../model/jam-types';
import {AudioModule} from '../../modules/audio/audio.module';
import {TranscoderStream} from '../../modules/audio/transcoder/transcoder-stream';
import {ApiBinaryResult} from '../../typings';
import {fileSuffix} from '../../utils/fs-utils';
import {Episode} from '../episode/episode.model';
import {Track} from '../track/track.model';
import {User} from '../user/user.model';

export class StreamService {

	constructor(private audioModule: AudioModule) {
	}

	async streamFile(filename: string, id: string, sourceFormat?: string, destFormat?: string, maxBitRate?: number): Promise<ApiBinaryResult> {
		let stats: fse.Stats | undefined;
		try {
			stats = await fse.stat(filename);
		} catch (e) {
			stats = undefined;
		}
		if (!stats) {
			return Promise.reject(Error('File not found'));
		}
		destFormat = destFormat || AudioFormatType.mp3;
		if (destFormat[0] === '.') {
			destFormat = destFormat.slice(1);
		}
		const bitRate = maxBitRate || 0;
		if (destFormat !== 'raw' && TranscoderStream.needsTranscoding(sourceFormat || fileSuffix(filename), destFormat, bitRate)) {
			return this.audioModule.getTranscode(filename, id, destFormat, bitRate);
		}
		return {file: {filename, name: `${id}.${destFormat}`}};
	}

	async streamTrack(track: Track, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		return this.streamFile(path.join(track.path, track.name), track.id, track.media.format, format, maxBitRate);
	}

	async streamEpisode(episode: Episode, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		if (episode.path && episode.media) {
			return this.streamFile(episode.path, episode.id, episode.media.format, format, maxBitRate);
		}
		return Promise.reject(GenericError('Podcast episode not ready'));
	}

}

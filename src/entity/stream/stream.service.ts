import fse from 'fs-extra';
import path from 'path';
import {AudioModule} from '../../modules/audio/audio.module';
import {TranscoderStream} from '../../modules/audio/transcoder/transcoder-stream';
import {fileSuffix} from '../../utils/fs-utils';
import {Episode} from '../episode/episode';
import {Track} from '../track/track';
import {User} from '../user/user';
import {Inject, InRequestScope} from 'typescript-ioc';
import {ApiBinaryResult, GenericError, InvalidParamError} from '../../modules/rest';
import {AudioFormatType, DBObjectType} from '../../types/enums';
import {Base} from '../base/base';

@InRequestScope
export class StreamService {
	@Inject
	private audioModule!: AudioModule;

	async streamFile(filename: string, id: string, sourceFormat?: string, destFormat?: string, maxBitRate?: number): Promise<ApiBinaryResult> {
		let stats: fse.Stats | undefined;
		try {
			stats = await fse.stat(filename);
		} catch {
			stats = undefined;
		}
		if (!stats) {
			return Promise.reject(GenericError('File not found'));
		}
		destFormat = destFormat || AudioFormatType.mp3;
		if (destFormat[0] === '.') {
			destFormat = destFormat.slice(1);
		}
		const bitRate = maxBitRate || 0;
		if (destFormat !== 'raw' && TranscoderStream.needsTranscoding(sourceFormat || fileSuffix(filename), destFormat, bitRate)) {
			return this.audioModule.transcoder.get(filename, id, destFormat, bitRate);
		}
		return {file: {filename, name: `${id}.${destFormat}`}};
	}

	async streamTrack(track: Track, format: string | undefined, maxBitRate: number | undefined): Promise<ApiBinaryResult> {
		const tag = await track.tag.get();
		return await this.streamFile(path.join(track.path, track.fileName), track.id, tag?.mediaFormat, format, maxBitRate);
	}

	async streamEpisode(episode: Episode, format: string | undefined, maxBitRate: number | undefined): Promise<ApiBinaryResult> {
		const tag = await episode.tag.get();
		if (episode.path && tag?.mediaFormat) {
			return this.streamFile(episode.path, episode.id, tag?.mediaFormat, format, maxBitRate);
		}
		return Promise.reject(GenericError('Podcast episode not ready'));
	}

	async streamDBObject(o: Base, type: DBObjectType, format: string | undefined, maxBitRate: number | undefined, _user: User): Promise<ApiBinaryResult> {
		switch (type) {
			case DBObjectType.track:
				return this.streamTrack(o as Track, format, maxBitRate);
			case DBObjectType.episode:
				return this.streamEpisode(o as Episode, format, maxBitRate);
			default:
		}
		return Promise.reject(InvalidParamError('Invalid Object Type for Streaming'));
	}

}

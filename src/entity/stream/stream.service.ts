import fse from 'fs-extra';
import path from 'path';
import {AudioModule} from '../../modules/audio/audio.module';
import {TranscoderStream} from '../../modules/audio/transcoder/transcoder-stream';
import {fileSuffix} from '../../utils/fs-utils';
import {Episode} from '../episode/episode';
import {Track} from '../track/track';
import {User} from '../user/user';
import {Inject, InRequestScope} from 'typescript-ioc';
import {ApiBinaryResult} from '../../modules/rest/builder/express-responder';
import {AudioFormatType, DBObjectType} from '../../types/enums';
import {GenericError} from '../../modules/rest/builder/express-error';
import {Base} from '../base/base';

@InRequestScope
export class StreamService {
	@Inject
	private audioModule!: AudioModule;

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
			return this.audioModule.transcoder.get(filename, id, destFormat, bitRate);
		}
		return {file: {filename, name: `${id}.${destFormat}`}};
	}

	async streamTrack(track: Track, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		const tag = await track.tag.get();
		// this.nowPlayingService.reportTrack(track, user).catch(e => log.error(e)); // do not wait
		return await this.streamFile(path.join(track.path, track.fileName), track.id, tag?.mediaFormat, format, maxBitRate);
	}

	async streamEpisode(episode: Episode, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		// this.nowPlayingService.reportEpisode(episode, user).catch(e => log.error(e)); // do not wait
		const tag = await episode.tag.get();
		if (episode.path && tag?.mediaFormat) {
			return this.streamFile(episode.path, episode.id, tag?.mediaFormat, format, maxBitRate);
		}
		return Promise.reject(GenericError('Podcast episode not ready'));
	}

	async streamDBObject(o: Base, type: DBObjectType, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<ApiBinaryResult> {
		switch (type) {
			case DBObjectType.track:
				return this.streamTrack(o as Track, format, maxBitRate, user);
			case DBObjectType.episode:
				return this.streamEpisode(o as Episode, format, maxBitRate, user);
			default:
		}
		return Promise.reject(Error('Invalid Object Type for Streaming'));
	}

}

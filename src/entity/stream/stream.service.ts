import fse from 'fs-extra';
import path from 'path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { TranscoderStream } from '../../modules/audio/transcoder/transcoder-stream.js';
import { fileSuffix } from '../../utils/fs-utils.js';
import { Episode } from '../episode/episode.js';
import { Track } from '../track/track.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { AudioFormatType, DBObjectType } from '../../types/enums.js';
import { Base } from '../base/base.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { GenericError, InvalidParamError } from '../../modules/deco/express/express-error.js';

export interface StreamOptions {
	maxBitRate?: number;
	timeOffset?: number;
	format?: string;
}

@InRequestScope
export class StreamService {
	@Inject
	private audioModule!: AudioModule;

	async streamFile(filename: string, id: string, sourceFormat?: string, opts?: StreamOptions): Promise<ApiBinaryResult> {
		let stats: fse.Stats | undefined;
		try {
			stats = await fse.stat(filename);
		} catch {
			stats = undefined;
		}
		if (!stats) {
			return Promise.reject(GenericError('File not found'));
		}
		let destFormat = opts?.format || AudioFormatType.mp3;
		if (destFormat[0] === '.') {
			destFormat = destFormat.slice(1);
		}
		const bitRate = opts?.maxBitRate || 0;
		// TOOD: support time opts?.timeOffset
		if (destFormat !== 'raw' && TranscoderStream.needsTranscoding(sourceFormat || fileSuffix(filename), destFormat, bitRate)) {
			return this.audioModule.transcoder.get(filename, id, destFormat, bitRate);
		}
		return { file: { filename, name: `${id}.${destFormat}` } };
	}

	async streamTrack(track: Track, opts?: StreamOptions): Promise<ApiBinaryResult> {
		const tag = await track.tag.get();
		return await this.streamFile(path.join(track.path, track.fileName), track.id, tag?.mediaFormat, opts);
	}

	async streamEpisode(episode: Episode, opts?: StreamOptions): Promise<ApiBinaryResult> {
		const tag = await episode.tag.get();
		if (episode.path && tag?.mediaFormat) {
			return this.streamFile(episode.path, episode.id, tag?.mediaFormat, opts);
		}
		return Promise.reject(GenericError('Podcast episode not ready'));
	}

	async streamDBObject(o: Base, type: DBObjectType, opts?: StreamOptions): Promise<ApiBinaryResult> {
		switch (type) {
			case DBObjectType.track:
				return this.streamTrack(o as Track, opts);
			case DBObjectType.episode:
				return this.streamEpisode(o as Episode, opts);
			default:
		}
		return Promise.reject(InvalidParamError('Invalid Object Type for Streaming'));
	}
}

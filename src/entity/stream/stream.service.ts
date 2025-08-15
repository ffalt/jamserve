import fse from 'fs-extra';
import path from 'node:path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { TranscoderStream } from '../../modules/audio/transcoder/transcoder-stream.js';
import { fileSuffix } from '../../utils/fs-utils.js';
import { Episode } from '../episode/episode.js';
import { Track } from '../track/track.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { AudioFormatType, DBObjectType } from '../../types/enums.js';
import { Base } from '../base/base.js';
import { ApiBinaryResult } from '../../modules/deco/express/express-responder.js';
import { genericError, invalidParameterError } from '../../modules/deco/express/express-error.js';

export interface StreamOptions {
	maxBitRate?: number;
	timeOffset?: number;
	format?: string;
}

@InRequestScope
export class StreamService {
	@Inject
	private readonly audioModule!: AudioModule;

	async streamFile(filename: string, id: string, sourceFormat?: string, options?: StreamOptions): Promise<ApiBinaryResult> {
		let stats: fse.Stats | undefined;
		try {
			stats = await fse.stat(filename);
		} catch {
			stats = undefined;
		}
		if (!stats) {
			return Promise.reject(genericError('File not found'));
		}
		let destinationFormat = options?.format ?? AudioFormatType.mp3;
		if (destinationFormat.startsWith('.')) {
			destinationFormat = destinationFormat.slice(1);
		}
		const bitRate = options?.maxBitRate ?? 0;
		// TOOD: support time opts?.timeOffset
		if (destinationFormat !== 'raw' && TranscoderStream.needsTranscoding(sourceFormat ?? fileSuffix(filename), destinationFormat, bitRate)) {
			return this.audioModule.transcoder.get(filename, id, destinationFormat, bitRate);
		}
		return { file: { filename, name: `${id}.${destinationFormat}` } };
	}

	async streamTrack(track: Track, options?: StreamOptions): Promise<ApiBinaryResult> {
		const tag = await track.tag.get();
		return await this.streamFile(path.join(track.path, track.fileName), track.id, tag?.mediaFormat, options);
	}

	async streamEpisode(episode: Episode, options?: StreamOptions): Promise<ApiBinaryResult> {
		const tag = await episode.tag.get();
		if (episode.path && tag?.mediaFormat) {
			return this.streamFile(episode.path, episode.id, tag.mediaFormat, options);
		}
		return Promise.reject(genericError('Podcast episode not ready'));
	}

	async streamDBObject(o: Base, type: DBObjectType, options?: StreamOptions): Promise<ApiBinaryResult> {
		switch (type) {
			case DBObjectType.track: {
				return this.streamTrack(o as Track, options);
			}
			case DBObjectType.episode: {
				return this.streamEpisode(o as Episode, options);
			}
			default:
		}
		return Promise.reject(invalidParameterError('Invalid Object Type for Streaming'));
	}
}

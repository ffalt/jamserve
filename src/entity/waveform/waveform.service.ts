import path from 'path';
import fse from 'fs-extra';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { WaveformResult } from '../../modules/audio/waveform/waveform.module.js';
import { DBObjectType, WaveformFormatType } from '../../types/enums.js';
import { Track } from '../track/track.js';
import { Episode } from '../episode/episode.js';
import { Base } from '../base/base.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../utils/logger.js';
import { GenericError, InvalidParamError } from '../../modules/deco/express/express-error.js';

const log = logger('Waveform');

export const WaveformDefaultFormat = WaveformFormatType.svg;

export interface WaveFormData {
	/** The version number of the waveform data format. */
	version: number;
	/** The number of waveform channels present (version 2 only). */
	channels?: number;
	/** Sample rate of original audio file (Hz). */
	sample_rate: number;
	/** Number of audio samples per waveform minimum/maximum pair. */
	samples_per_pixel: number;
	/** Resolution of waveform data. May be either 8 or 16. */
	bits: number;
	/** Length of waveform data (number of minimum and maximum value pairs per channel). */
	length: number;
	/** Array of minimum and maximum waveform data points, interleaved. Depending on bits, each value may be in the range -128 to +127 or -32768 to +32727. */
	data: Array<number>;
}

@InRequestScope
export class WaveformService {
	@Inject
	private readonly audioModule!: AudioModule;

	async getWaveform(obj: Base, objType: DBObjectType, format?: WaveformFormatType, width?: number): Promise<WaveformResult> {
		format = (format ?? WaveformDefaultFormat);
		switch (objType) {
			case DBObjectType.track:
				return this.getTrackWaveform(obj as Track, format, width);
			case DBObjectType.episode:
				return this.getEpisodeWaveform(obj as Episode, format, width);
			default:
		}
		return Promise.reject(InvalidParamError('Invalid Object Type for Waveform generation'));
	}

	async getWaveformSVG(obj: Base, objType: DBObjectType, width?: number): Promise<string | undefined> {
		const result = await this.getWaveform(obj, objType, WaveformFormatType.svg, width);
		if (result) {
			if (result.buffer) {
				return result.buffer.buffer.toString();
			}
			if (result.file) {
				try {
					return (await fse.readFile(result.file.filename)).toString();
				} catch (e: any) {
					log.error(e);
					return Promise.reject(GenericError('Invalid waveform result'));
				}
			}
			return Promise.reject(GenericError('Invalid svg waveform result'));
		}
		return;
	}

	async getWaveformJSON(obj: Base, objType: DBObjectType): Promise<WaveFormData | undefined> {
		const result = await this.getWaveform(obj, objType, WaveformFormatType.json);
		if (result) {
			if (result.json) {
				return result.json;
			}
			if (result.buffer) {
				return JSON.parse(result.buffer.buffer.toString());
			}
			if (result.file) {
				try {
					return await fse.readJSON(result.file.filename);
				} catch (e: any) {
					log.error(e);
					return Promise.reject(GenericError('Invalid json waveform result'));
				}
			}
			return Promise.reject(GenericError('Invalid waveform result'));
		}
		return;
	}

	async getTrackWaveform(track: Track, format: WaveformFormatType, width?: number): Promise<WaveformResult> {
		return this.audioModule.waveform.get(track.id, path.join(track.path, track.fileName), format, width);
	}

	async getEpisodeWaveform(episode: Episode, format: WaveformFormatType, width?: number): Promise<WaveformResult> {
		if (episode.id && episode.path) {
			return this.audioModule.waveform.get(episode.id, episode.path, format, width);
		}
		return Promise.reject(GenericError('Podcast episode not ready'));
	}
}

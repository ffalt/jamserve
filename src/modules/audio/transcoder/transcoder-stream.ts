import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import {AudioFormatType} from '../../../model/jam-types';
import {StreamData} from '../../../typings';
import {SupportedTranscodeAudioFormat} from '../../../utils/filetype';

export abstract class TranscoderStream implements StreamData {
	static needsTranscoding(mediaFormat: string, format: string, maxBitRate: number): boolean {
		return (format !== mediaFormat) || (maxBitRate > 0);
	}

	static validTranscoding(format: AudioFormatType): boolean {
		return SupportedTranscodeAudioFormat.includes(format);
	}

	static async getAvailableFormats(): Promise<Array<{ format: string, name: string }>> {
		return new Promise<Array<{ format: string, name: string }>>((resolve, reject) => {
			ffmpeg().getAvailableFormats((err, formats) => {
				if (err || !formats) {
					return reject(err);
				}
				resolve(Object.keys(formats).filter(key => formats[key].canDemux).map(key => {
					return {format: key, name: formats[key].description};
				}));
			});
		});
	}

	abstract pipe(stream: express.Response): void;
}

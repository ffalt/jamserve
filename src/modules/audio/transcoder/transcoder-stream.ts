import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import {AudioFormatType} from '../../../model/jam-types';
import {StreamData} from '../../../typings';
import {SupportedTranscodeAudioFormat} from '../../../utils/filetype';
import {logger} from '../../../utils/logger';

const log = logger('transcoder.stream');

export abstract class TranscoderStream implements StreamData {
	static needsTranscoding(mediaFormat: string, format: string, maxBitRate: number): boolean {
		return (format !== mediaFormat) || (maxBitRate > 0);
	}

	static validTranscoding(format: AudioFormatType): boolean {
		return SupportedTranscodeAudioFormat.includes(format);
	}

	static async getAvailableFormats(): Promise<Array<{ format: string; name: string }>> {
		return new Promise<Array<{ format: string; name: string }>>((resolve, reject) => {
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

	static getTranscodeProc(source: string, format: string, maxBitRate: number): ffmpeg.FfmpegCommand {
		const proc = ffmpeg({source})
			.withNoVideo();
		switch (format) {
			case AudioFormatType.flv:
				return proc.toFormat(format).addOptions(['-ar 44100', `-maxrate ${maxBitRate || 128}k`]);
			case AudioFormatType.ogg:
			case AudioFormatType.oga:
				return proc.toFormat(format)
					.withAudioCodec('libvorbis')
					.addOptions([`-maxrate ${maxBitRate || 128}k`]);
			case AudioFormatType.mp3:
				return proc
					.toFormat(format)
					.withAudioBitrate(`${maxBitRate || 128}k`)
					.withAudioCodec('libmp3lame');
			case  AudioFormatType.m4a:
				return proc
					.toFormat('mp4')
					.withAudioBitrate(`${maxBitRate || 128}k`);
			default:
				return proc
					.toFormat(format)
					.withAudioBitrate(`${maxBitRate || 128}k`);
		}
	}

	static async transcodeToFile(source: string, destination: string, format: string, maxBitRate: number): Promise<void> {
		return new Promise((resolve, reject) => {
			const proc = TranscoderStream.getTranscodeProc(source, format, maxBitRate);
			proc
				.on('start', cmd => {
					log.debug(`ffmpeg started with ${cmd}`);
				})
				.on('end', () => {
					resolve();
				})
				.on('error', (err: Error) => {
					reject(err);
				})
				.save(destination);
		});
	}

	abstract pipe(stream: express.Response): void;
}

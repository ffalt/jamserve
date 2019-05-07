import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import {AudioFormatType} from '../../../model/jam-types';
import Logger from '../../../utils/logger';
import {TranscoderStream} from './transcoder-stream';

const log = Logger('audio.transcoder.live');

export class LiveTranscoderStream extends TranscoderStream {
	filename: string;
	format: string;
	maxBitRate: number;
	duration?: number;

	constructor(filename: string, format: string, maxBitRate: number, duration?: number) {
		super();
		this.filename = filename;
		this.format = format;
		this.maxBitRate = maxBitRate;
		this.duration = duration;
		if (maxBitRate <= 0) {
			this.maxBitRate = 128;
		}
	}

	//
	// private getSize(cb: (length: number) => void) {
	// 	if (this.duration !== undefined && this.duration > 0) {
	// 		const length = Math.round((this.maxBitRate * 1000 * this.duration) / 8);
	// 		return cb(length);
	// 	}
	// 	ffmpeg.ffprobe(this.filename, (err, metadata) => {
	// 		let length = 0;
	// 		if (metadata && metadata.format && metadata.format.duration) {
	// 			const duration = metadata.format ? parseInt(metadata.format.duration, 10) : 0;
	// 			length = Math.round((this.maxBitRate * 1000 * duration) / 8);
	// 		}
	// 		cb(length);
	// 	});
	// }

	pipe(stream: express.Response): void {
		log.info('Start transcode streaming', this.format, this.maxBitRate);
		const options = {source: this.filename, nolog: true};
		const proc = ffmpeg(options as ffmpeg.FfmpegCommandOptions);
		if (this.format === AudioFormatType.mp3) {
			proc.withAudioCodec('libmp3lame');
		}
		proc.withNoVideo()
			.toFormat(this.format)
			.withAudioBitrate(this.maxBitRate + 'k')
			.on('end', () => {
				log.debug('file has been transcoded successfully');
			})
			.on('error', (err: Error) => {
				log.error('an error happened while transcoding: ' + err.message);
			});
		stream.contentType(this.format);
		proc.writeToStream(stream, {end: true});
	}

}

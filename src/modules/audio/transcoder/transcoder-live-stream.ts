import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import {AudioFormatType} from '../../../model/jam-types';
import {logger} from '../../../utils/logger';
import {TranscoderStream} from './transcoder-stream';

const log = logger('audio.transcoder.live');

export class LiveTranscoderStream extends TranscoderStream {

	constructor(public filename: string, public format: string, public maxBitRate: number, public duration?: number) {
		super();
		if (maxBitRate <= 0) {
			this.maxBitRate = 128;
		}
	}

	pipe(stream: express.Response): void {
		log.info('Start transcode streaming', this.format, this.maxBitRate);
		const options = {source: this.filename, nolog: true};
		const proc = ffmpeg(options as ffmpeg.FfmpegCommandOptions);
		if (this.format === AudioFormatType.mp3) {
			proc.withAudioCodec('libmp3lame');
		}
		proc.withNoVideo()
			.toFormat(this.format)
			.withAudioBitrate(`${this.maxBitRate}k`)
			.on('end', () => {
				log.debug('file has been transcoded successfully');
			})
			.on('error', (err: Error) => {
				log.error(`an error happened while transcoding: ${err.message}`);
			});
		stream.contentType(this.format);
		proc.writeToStream(stream, {end: true});
	}

}

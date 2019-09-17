import express from 'express';
import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import tmp from 'tmp';
import {AudioFormatType} from '../../../model/jam-types';
import {logger} from '../../../utils/logger';
import {TranscoderStream} from './transcoder-stream';

const log = logger('audio.transcoder.pre');

export class PreTranscoderStream extends TranscoderStream {

	constructor(public filename: string, public format: string, public maxBitRate: number) {
		super();
		if (maxBitRate <= 0) {
			this.maxBitRate = 128;
		}
	}

	pipe(stream: express.Response): void {
		log.info('Start transcoding first and stream after', this.format, this.maxBitRate);
		tmp.file((err, filename, fd, cleanupCallback) => {
			if (err) {
				throw err;
			}
			const options = {source: this.filename, nolog: true};
			const proc = ffmpeg(options as ffmpeg.FfmpegCommandOptions);
			if (this.format === AudioFormatType.mp3) {
				proc.withAudioCodec('libmp3lame');
			}
			console.log(options);
			proc.withNoVideo()
				.toFormat(this.format)
				.withAudioBitrate(`${this.maxBitRate}k`)
				.on('end', () => {
					log.info('transcoding ended, sending file now');
					stream.contentType(this.format);
					stream.setHeader('Content-Length', fs.statSync(filename).size);
					const rs = fs.createReadStream(filename, {autoClose: true});
					rs.on('end', () => {
						cleanupCallback();
					});
					rs.on('error', msg => {
						log.error(msg);
						cleanupCallback();
					});
					rs.pipe(stream);
				})
				.on('error', (err2: Error) => {
					cleanupCallback();
					const msg = `an error happened while transcoding: ${err2.message}`;
					stream.status(400).send(msg);
					log.error(msg);
				});
			proc.save(filename);
		});
	}

}

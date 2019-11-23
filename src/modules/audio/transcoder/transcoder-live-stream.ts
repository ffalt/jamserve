import express from 'express';
import {logger} from '../../../utils/logger';
import {TranscoderStream} from './transcoder-stream';

const log = logger('audio.transcoder.live');

export class LiveTranscoderStream extends TranscoderStream {

	constructor(public filename: string, public format: string, public maxBitRate: number) {
		super();
		if (maxBitRate <= 0) {
			this.maxBitRate = 128;
		}
	}

	pipe(stream: express.Response): void {
		log.info('Start transcode streaming', this.format, this.maxBitRate);
		stream.contentType(this.format);
		const proc = TranscoderStream.getTranscodeProc(this.filename, this.format, this.maxBitRate);
		proc
			.on('end', () => {
				log.debug('file has been transcoded successfully');
			})
			.on('error', (err: Error) => {
				log.error(`an error happened while transcoding: ${err.message}`);
			})
			.writeToStream(stream, {end: true});
	}

}

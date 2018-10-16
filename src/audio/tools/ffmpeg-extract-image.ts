import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';
import {NodeErrorCallback} from '../../typings';

export function extractFFmpegImage(filename: string, index: number, stream: fs.WriteStream, callback: NodeErrorCallback) {
	const proc = ffmpeg({source: filename})
		.addOption('-map', '0:' + index)
		.toFormat('mjpeg');
	proc.on('end', () => {
		// logger.verbose('image extracted');
		callback();
	}).on('error', (err) => {
		// logger.error('an error happened while extracting image: ' + err.message + ' ' + filename);
		callback(err);
	});
	proc.writeToStream(stream, {end: true});
}

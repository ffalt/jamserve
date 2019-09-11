import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export async function extractFFmpegImage(filename: string, index: number, stream: fs.WriteStream): Promise<void> {
	return new Promise((resolve, reject) => {
		const proc = ffmpeg({source: filename})
			.addOption('-map', '0:' + index)
			.toFormat('mjpeg')
			.on('end', () => {
				// logger.verbose('image extracted');
				resolve();
			})
			.on('error', err => {
				// logger.error('an error happened while extracting image: ' + err.message + ' ' + filename);
				reject(err);
			});
		proc.writeToStream(stream, {end: true});
	});
}

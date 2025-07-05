import ffmpeg from 'fluent-ffmpeg';
import fs from 'fs';

export async function extractFFmpegImage(filename: string, index: number, stream: fs.WriteStream): Promise<void> {
	return new Promise((resolve, reject) => {
		const proc = ffmpeg({ source: filename })
			.addOption('-map', `0:${index}`)
			.toFormat('mjpeg')
			.on('end', () => {
				resolve();
			})
			.on('error', (err: Error) => {
				reject(err);
			});
		proc.writeToStream(stream, { end: true });
	});
}

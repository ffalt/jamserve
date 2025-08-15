import ffmpeg from 'fluent-ffmpeg';
import fs from 'node:fs';

export async function extractFFmpegImage(filename: string, index: number, stream: fs.WriteStream): Promise<void> {
	return new Promise((resolve, reject) => {
		const proc = ffmpeg({ source: filename })
			.addOption('-map', `0:${index}`)
			.toFormat('mjpeg')
			.on('end', () => {
				resolve();
			})
			.on('error', (error: unknown) => {
				reject(error);
			});
		proc.writeToStream(stream, { end: true });
	});
}

import ffmpeg from 'fluent-ffmpeg';
import path from "path";

// 	// ffmpeg -i input.mp3 -c:a copy -c:v copy output.mp3

export async function rewriteWriteFFmpeg(filename: string, destination: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const proc = ffmpeg({source: filename})
			.addOption('-c:a', 'copy')
			.addOption('-c:v', 'copy')
			.output(destination)
			.format(path.extname(filename).slice(1));
		proc.on('end', () => {
			resolve();
		}).on('error', (err) => {
			reject(err);
		});
		proc.run();
	});
}

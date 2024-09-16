import ffmpeg from 'fluent-ffmpeg';
import {fileSuffix} from '../../../utils/fs-utils.js';

// 	// ffmpeg -i input.mp3 -map_metadata -1 -c:a copy -c:v copy output.mp3

export async function rewriteWriteFFmpeg(filename: string, destination: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		const proc = ffmpeg({source: filename})
			.addOption('-c:a', 'copy')
			.addOption('-c:v', 'copy')
			.addOption('-map_metadata', '-1')
			.output(destination)
			.format(fileSuffix(filename));
		proc.on('end', () => {
			resolve();
		}).on('error', err => {
			reject(err);
		});
		proc.run();
	});
}

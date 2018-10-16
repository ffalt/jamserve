import request from 'request';
import fs from 'fs';

export function downloadFile(url: string, filename: string): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		request(url)
			.pipe(fs.createWriteStream(filename))
			.on('close', (err: Error) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
	});
}

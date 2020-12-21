import fs from 'fs';
import fetch from 'node-fetch';
import {fileDeleteIfExists} from './fs-utils';

export async function downloadFile(url: string, filename: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Unexpected Response ${response.statusText}`);
	}
	return new Promise((resolve, reject) => {
		const dest = fs.createWriteStream(filename);
		response.body.pipe(dest);
		dest.on('close', () => resolve());
		dest.on('error', (e) => {
			fileDeleteIfExists(filename).then(() => {
				reject(e);
			}).catch(_ => {
				reject(e);
			});
		});
	});
}

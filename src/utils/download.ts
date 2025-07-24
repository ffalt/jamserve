import fs from 'node:fs';
import fetch from 'node-fetch';
import { fileDeleteIfExists } from './fs-utils.js';

export async function downloadFile(url: string, filename: string): Promise<void> {
	const response = await fetch(url);
	if (!response.ok) {
		throw new Error(`Unexpected Response ${response.statusText || response.status}`);
	}
	return new Promise((resolve, reject) => {
		const dest = fs.createWriteStream(filename);
		if (!response.body) {
			return reject(new Error('Bad file stream'));
		}
		response.body.pipe(dest);
		dest.on('close', () => resolve());
		dest.on('error', (e: Error) => {
			fileDeleteIfExists(filename).then(() => {
				reject(e);
			}).catch(_ => {
				reject(e);
			});
		});
	});
}
